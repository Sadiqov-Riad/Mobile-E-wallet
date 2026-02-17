using System.Security.Claims;
using EWalletApi.Data;
using EWalletApi.DTOs;
using EWalletApi.Models;
using EWalletApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EWalletApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WalletController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly INotificationService _notifications;

    public WalletController(AppDbContext db, INotificationService notifications)
    {
        _db = db;
        _notifications = notifications;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue("sub")!);

    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactions(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 30,
        [FromQuery] string? type = null)
    {
        var userId = GetUserId();
        var query = _db.WalletTransactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .AsQueryable();

        if (!string.IsNullOrEmpty(type))
            query = query.Where(t => t.Type == type);

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TransactionDto
            {
                Id = t.Id,
                Type = t.Type,
                Category = t.Category,
                Amount = t.Amount,
                Currency = t.Currency,
                BalanceAfter = t.BalanceAfter,
                Description = t.Description,
                CounterpartyId = t.CounterpartyId,
                CounterpartyName = t.CounterpartyName,
                CreatedAt = t.CreatedAt,
            })
            .ToListAsync();

        return Ok(new TransactionListResponse
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize,
        });
    }

    [HttpGet("transactions/{id}")]
    public async Task<IActionResult> GetTransaction(Guid id)
    {
        var userId = GetUserId();
        var tx = await _db.WalletTransactions
            .Where(t => t.Id == id && t.UserId == userId)
            .Select(t => new TransactionDto
            {
                Id = t.Id,
                Type = t.Type,
                Category = t.Category,
                Amount = t.Amount,
                Currency = t.Currency,
                BalanceAfter = t.BalanceAfter,
                Description = t.Description,
                CounterpartyId = t.CounterpartyId,
                CounterpartyName = t.CounterpartyName,
                CreatedAt = t.CreatedAt,
            })
            .FirstOrDefaultAsync();

        if (tx is null) return NotFound();
        return Ok(tx);
    }

    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
    {
        if (request.Amount <= 0)
            return BadRequest(new { error = "Amount must be positive" });

        var senderId = GetUserId();
        var sender = await _db.Users.FindAsync(senderId);
        if (sender is null) return NotFound();

        if (sender.Balance < request.Amount)
            return BadRequest(new { error = "Insufficient funds" });

        var recipient = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.RecipientUsername);
        if (recipient is null)
            return NotFound(new { error = "Recipient not found" });

        if (recipient.Id == senderId)
            return BadRequest(new { error = "Cannot transfer to yourself" });

        sender.Balance -= request.Amount;
        recipient.Balance += request.Amount;

        var senderTx = new WalletTransaction
        {
            UserId = senderId,
            Type = "debit",
            Category = "Transfer",
            Amount = -request.Amount,
            Currency = sender.Currency,
            BalanceAfter = sender.Balance,
            Description = request.Description ?? $"Transfer to {recipient.Username}",
            CounterpartyId = recipient.Id,
            CounterpartyName = recipient.FullName ?? recipient.Username,
        };

        var recipientTx = new WalletTransaction
        {
            UserId = recipient.Id,
            Type = "credit",
            Category = "Transfer",
            Amount = request.Amount,
            Currency = recipient.Currency,
            BalanceAfter = recipient.Balance,
            Description = request.Description ?? $"Transfer from {sender.Username}",
            CounterpartyId = senderId,
            CounterpartyName = sender.FullName ?? sender.Username,
        };

        _db.WalletTransactions.AddRange(senderTx, recipientTx);
        await _db.SaveChangesAsync();

        await _notifications.SendAsync(
            senderId, "transfer", "Money Sent",
            $"You sent {request.Amount:F2} {sender.Currency} to {recipient.FullName ?? recipient.Username}");

        await _notifications.SendAsync(
            recipient.Id, "transfer", "Money Received",
            $"You received {request.Amount:F2} {sender.Currency} from {sender.FullName ?? sender.Username}");

        return Ok(new
        {
            transaction = new TransactionDto
            {
                Id = senderTx.Id,
                Type = senderTx.Type,
                Category = senderTx.Category,
                Amount = senderTx.Amount,
                Currency = senderTx.Currency,
                BalanceAfter = senderTx.BalanceAfter,
                Description = senderTx.Description,
                CounterpartyId = senderTx.CounterpartyId,
                CounterpartyName = senderTx.CounterpartyName,
                CreatedAt = senderTx.CreatedAt,
            },
            balance = sender.Balance,
        });
    }

    [HttpGet("search-users")]
    public async Task<IActionResult> SearchUsers([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
            return Ok(Array.Empty<object>());

        var userId = GetUserId();
        var users = await _db.Users
            .Where(u => u.Id != userId && (
                u.Username.Contains(q) ||
                (u.FullName != null && u.FullName.Contains(q)) ||
                u.Email.Contains(q)))
            .Take(10)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.FullName,
                u.AvatarPath,
            })
            .ToListAsync();

        return Ok(users);
    }
}
