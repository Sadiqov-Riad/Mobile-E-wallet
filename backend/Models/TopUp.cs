using System.ComponentModel.DataAnnotations;

namespace EWalletApi.Models;

public class TopUp
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public decimal Amount { get; set; }

    public long AmountMinor { get; set; }

    [MaxLength(10)]
    public required string Currency { get; set; }

    [MaxLength(50)]
    public required string Method { get; set; }

    [MaxLength(100)]
    public required string StripePaymentIntentId { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }
}
