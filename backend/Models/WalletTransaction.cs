using System.ComponentModel.DataAnnotations;

namespace EWalletApi.Models;

public class WalletTransaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    [MaxLength(20)]
    public required string Type { get; set; }

    [MaxLength(50)]
    public required string Category { get; set; }

    public decimal Amount { get; set; }

    [MaxLength(10)]
    public required string Currency { get; set; }

    public decimal BalanceAfter { get; set; }

    [MaxLength(200)]
    public string? Description { get; set; }

    public Guid? CounterpartyId { get; set; }

    [MaxLength(100)]
    public string? CounterpartyName { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
