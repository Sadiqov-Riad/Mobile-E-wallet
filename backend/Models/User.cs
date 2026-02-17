using System.ComponentModel.DataAnnotations;

namespace EWalletApi.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(50)]
    public required string Username { get; set; }

    [MaxLength(100)]
    public required string Email { get; set; }

    public required string PasswordHash { get; set; }

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(100)]
    public string? FullName { get; set; }

    [MaxLength(500)]
    public string? AvatarPath { get; set; }

    public decimal Balance { get; set; } = 0;

    [MaxLength(10)]
    public string Currency { get; set; } = "USD";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginAt { get; set; }

    public string RefreshToken { get; set; } = string.Empty;

    public DateTime? RefreshTokenExpiryTime { get; set; }
}
