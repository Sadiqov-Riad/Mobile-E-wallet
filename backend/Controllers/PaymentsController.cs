using System.Security.Claims;
using EWalletApi.Data;
using EWalletApi.Models;
using EWalletApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace EWalletApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly INotificationService _notifications;

    public PaymentsController(AppDbContext db, IConfiguration config, INotificationService notifications)
    {
        _db = db;
        _config = config;
        _notifications = notifications;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue("sub")!);

    [HttpGet("config")]
    public IActionResult GetConfig()
    {
        var pk = _config["Stripe:PublishableKey"];
        return Ok(new { publishableKey = pk });
    }

    [Authorize]
    [HttpPost("topup/intent")]
    public async Task<IActionResult> CreateTopUpIntent([FromBody] TopUpIntentRequest request)
    {
        if (request.Amount <= 0)
            return BadRequest(new { error = "Amount must be positive" });

        var userId = GetUserId();
        var user = await _db.Users.FindAsync(userId);
        if (user is null) return NotFound();

        var currency = (request.Currency ?? user.Currency).ToLowerInvariant();
        var amountMinor = (long)(request.Amount * 100);

        StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];

        var options = new PaymentIntentCreateOptions
        {
            Amount = amountMinor,
            Currency = currency,
            Metadata = new Dictionary<string, string>
            {
                ["userId"] = userId.ToString(),
                ["type"] = "topup",
            },
        };

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(options);

        var topUp = new TopUp
        {
            UserId = userId,
            Amount = request.Amount,
            AmountMinor = amountMinor,
            Currency = currency.ToUpperInvariant(),
            Method = "stripe_card",
            StripePaymentIntentId = intent.Id,
            Status = "pending",
        };

        _db.TopUps.Add(topUp);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            paymentIntentId = intent.Id,
            clientSecret = intent.ClientSecret,
            topUpId = topUp.Id,
            publishableKey = _config["Stripe:PublishableKey"],
        });
    }

    [Authorize]
    [HttpGet("topup/{id}/status")]
    public async Task<IActionResult> GetTopUpStatus(Guid id)
    {
        var userId = GetUserId();
        var topUp = await _db.TopUps.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (topUp is null) return NotFound();

        return Ok(new
        {
            topUp.Id,
            topUp.Status,
            topUp.Amount,
            topUp.Currency,
            topUp.CompletedAt,
        });
    }

    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var whSecret = _config["Stripe:WebhookSecret"];

        Event stripeEvent;
        try
        {
            stripeEvent = EventUtility.ConstructEvent(json,
                Request.Headers["Stripe-Signature"], whSecret);
        }
        catch
        {
            return BadRequest();
        }

        if (stripeEvent.Type == "payment_intent.succeeded")
        {
            var intent = (PaymentIntent)stripeEvent.Data.Object;
            var topUp = await _db.TopUps.FirstOrDefaultAsync(t => t.StripePaymentIntentId == intent.Id);

            if (topUp is not null && topUp.Status == "pending")
            {
                topUp.Status = "completed";
                topUp.CompletedAt = DateTime.UtcNow;

                var user = await _db.Users.FindAsync(topUp.UserId);
                if (user is not null)
                {
                    user.Balance += topUp.Amount;

                    var tx = new WalletTransaction
                    {
                        UserId = user.Id,
                        Type = "credit",
                        Category = "Top Up",
                        Amount = topUp.Amount,
                        Currency = topUp.Currency,
                        BalanceAfter = user.Balance,
                        Description = $"Card top-up via Stripe",
                    };
                    _db.WalletTransactions.Add(tx);

                    await _notifications.SendAsync(
                        user.Id, "deposit", "Funds Added",
                        $"{topUp.Amount:F2} {topUp.Currency} has been added to your balance");
                }

                await _db.SaveChangesAsync();
            }
        }

        return Ok();
    }
}

public class TopUpIntentRequest
{
    public decimal Amount { get; set; }
    public string? Currency { get; set; }
}
