namespace EWalletApi.DTOs;

public class UpdateProfileRequest
{
    public string? FullName { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Currency { get; set; }
}

public class AdjustBalanceRequest
{
    public decimal Amount { get; set; }
}
