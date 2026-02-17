using System.ComponentModel.DataAnnotations;

namespace EWalletApi.Models;

public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    [MaxLength(30)]
    public required string Type { get; set; }

    [MaxLength(200)]
    public required string Title { get; set; }

    [MaxLength(1000)]
    public required string Message { get; set; }

    public bool IsRead { get; set; } = false;

    public string? Data { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
