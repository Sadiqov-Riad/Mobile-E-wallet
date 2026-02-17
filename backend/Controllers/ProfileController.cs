using System.Security.Claims;
using EWalletApi.Data;
using EWalletApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EWalletApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public ProfileController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue("sub")!);

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _db.Users.FindAsync(GetUserId());
        if (user is null) return NotFound();

        return Ok(MapToDto(user));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var user = await _db.Users.FindAsync(GetUserId());
        if (user is null) return NotFound();

        if (request.FullName is not null)
            user.FullName = request.FullName;

        if (request.Username is not null)
        {
            var taken = await _db.Users.AnyAsync(u => u.Username == request.Username && u.Id != user.Id);
            if (taken) return Conflict(new { error = "Username is already taken" });
            user.Username = request.Username;
        }

        if (request.Email is not null)
        {
            var emailLower = request.Email.ToLowerInvariant();
            var taken = await _db.Users.AnyAsync(u => u.Email == emailLower && u.Id != user.Id);
            if (taken) return Conflict(new { error = "Email is already taken" });
            user.Email = emailLower;
        }

        if (request.PhoneNumber is not null)
            user.PhoneNumber = request.PhoneNumber;

        if (request.Currency is not null)
            user.Currency = request.Currency.ToUpperInvariant();

        await _db.SaveChangesAsync();
        return Ok(MapToDto(user));
    }

    [HttpPost("avatar")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        if (file.Length == 0)
            return BadRequest(new { error = "No file uploaded" });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext is not (".jpg" or ".jpeg" or ".png" or ".webp"))
            return BadRequest(new { error = "Only jpg, png, webp images are allowed" });

        var user = await _db.Users.FindAsync(GetUserId());
        if (user is null) return NotFound();

        if (!string.IsNullOrEmpty(user.AvatarPath))
        {
            var oldFile = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), user.AvatarPath.TrimStart('/'));
            if (System.IO.File.Exists(oldFile))
                System.IO.File.Delete(oldFile);
        }

        var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "avatars");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{user.Id}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        user.AvatarPath = $"/avatars/{fileName}";
        await _db.SaveChangesAsync();

        return Ok(new { avatarUrl = user.AvatarPath });
    }

    [HttpDelete("avatar")]
    public async Task<IActionResult> DeleteAvatar()
    {
        var user = await _db.Users.FindAsync(GetUserId());
        if (user is null) return NotFound();

        if (!string.IsNullOrEmpty(user.AvatarPath))
        {
            var fullPath = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), user.AvatarPath.TrimStart('/'));
            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);
        }

        user.AvatarPath = null;
        await _db.SaveChangesAsync();

        return Ok(new { avatarUrl = (string?)null });
    }

    [HttpGet("balance")]
    public async Task<IActionResult> GetBalance()
    {
        var user = await _db.Users.FindAsync(GetUserId());
        if (user is null) return NotFound();

        return Ok(new { balance = user.Balance, currency = user.Currency });
    }

    [HttpPost("balance/deposit")]
    public async Task<IActionResult> Deposit([FromBody] AdjustBalanceRequest request)
    {
        if (request.Amount <= 0)
            return BadRequest(new { error = "Amount must be positive" });

        var user = await _db.Users.FindAsync(GetUserId());
        if (user is null) return NotFound();

        user.Balance += request.Amount;
        await _db.SaveChangesAsync();

        return Ok(new { balance = user.Balance, currency = user.Currency });
    }

    [HttpPost("balance/withdraw")]
    public async Task<IActionResult> Withdraw([FromBody] AdjustBalanceRequest request)
    {
        if (request.Amount <= 0)
            return BadRequest(new { error = "Amount must be positive" });

        var user = await _db.Users.FindAsync(GetUserId());
        if (user is null) return NotFound();

        if (user.Balance < request.Amount)
            return BadRequest(new { error = "Insufficient funds" });

        user.Balance -= request.Amount;
        await _db.SaveChangesAsync();

        return Ok(new { balance = user.Balance, currency = user.Currency });
    }

    private static UserDto MapToDto(Models.User u) => new()
    {
        Id = u.Id,
        Username = u.Username,
        Email = u.Email,
        PhoneNumber = u.PhoneNumber,
        FullName = u.FullName,
        CreatedAt = u.CreatedAt,
        Balance = u.Balance,
        Currency = u.Currency,
        AvatarUrl = u.AvatarPath
    };
}
