namespace EWalletApi.DTOs;

public class TransferRequest
{
    public required string RecipientUsername { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
}

public class TransactionDto
{
    public Guid Id { get; set; }
    public required string Type { get; set; }
    public required string Category { get; set; }
    public decimal Amount { get; set; }
    public required string Currency { get; set; }
    public decimal BalanceAfter { get; set; }
    public string? Description { get; set; }
    public Guid? CounterpartyId { get; set; }
    public string? CounterpartyName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TransactionListResponse
{
    public List<TransactionDto> Items { get; set; } = [];
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
