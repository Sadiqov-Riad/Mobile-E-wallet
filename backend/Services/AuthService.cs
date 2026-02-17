using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EWalletApi.Data;
using EWalletApi.DTOs;
using EWalletApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace EWalletApi.Services;

public interface IAuthService
{
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<AuthResponse?> RefreshAsync(string refreshToken);
    Task RevokeAsync(Guid userId);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        var emailLower = request.Email.ToLowerInvariant();

        if (await _db.Users.AnyAsync(u => u.Email == emailLower))
            return null;
        if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            return null;

        var user = new User
        {
            Username = request.Username,
            Email = emailLower,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return await GenerateTokens(user);
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var emailLower = request.Email.ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailLower);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        user.LastLoginAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return await GenerateTokens(user);
    }

    public async Task<AuthResponse?> RefreshAsync(string refreshToken)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.RefreshToken == refreshToken && u.RefreshTokenExpiryTime > DateTime.UtcNow);
        if (user is null) return null;

        return await GenerateTokens(user);
    }

    public async Task RevokeAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user is null) return;

        user.RefreshToken = string.Empty;
        user.RefreshTokenExpiryTime = null;
        await _db.SaveChangesAsync();
    }

    private async Task<AuthResponse> GenerateTokens(User user)
    {
        var jwtKey = _config["Jwt:Key"] ?? throw new Exception("Jwt:Key not configured");
        var issuer = _config["Jwt:Issuer"] ?? "EWalletApi";
        var audience = _config["Jwt:Audience"] ?? "EWalletMobileApp";
        var accessMinutes = int.Parse(_config["Jwt:AccessTokenMinutes"] ?? "30");
        var refreshDays = int.Parse(_config["Jwt:RefreshTokenDays"] ?? "7");

        var claims = new[]
        {
            new Claim("sub", user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("username", user.Username),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(accessMinutes),
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
        var refreshTokenValue = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        user.RefreshToken = refreshTokenValue;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshDays);
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                CreatedAt = user.CreatedAt,
                Balance = user.Balance,
                Currency = user.Currency,
                AvatarUrl = user.AvatarPath,
            }
        };
    }
}
