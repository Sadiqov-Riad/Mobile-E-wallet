using EWalletApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EWalletApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<WalletTransaction> WalletTransactions => Set<WalletTransaction>();
    public DbSet<TopUp> TopUps => Set<TopUp>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Username).IsUnique();
        });

        modelBuilder.Entity<WalletTransaction>(e =>
        {
            e.HasIndex(t => t.UserId);
            e.HasIndex(t => t.CreatedAt);
        });

        modelBuilder.Entity<TopUp>(e =>
        {
            e.HasIndex(t => t.UserId);
            e.HasIndex(t => t.StripePaymentIntentId).IsUnique();
        });

        modelBuilder.Entity<Notification>(e =>
        {
            e.HasIndex(n => n.UserId);
            e.HasIndex(n => n.CreatedAt);
        });
    }
}
