using EWalletApi.Data;
using EWalletApi.Hubs;
using EWalletApi.Models;
using Microsoft.AspNetCore.SignalR;

namespace EWalletApi.Services;

public interface INotificationService
{
    Task SendAsync(Guid userId, string type, string title, string message, string? data = null);
}

public class NotificationService : INotificationService
{
    private readonly AppDbContext _db;
    private readonly IHubContext<NotificationHub> _hub;

    public NotificationService(AppDbContext db, IHubContext<NotificationHub> hub)
    {
        _db = db;
        _hub = hub;
    }

    public async Task SendAsync(Guid userId, string type, string title, string message, string? data = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            Title = title,
            Message = message,
            Data = data,
        };

        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();

        await _hub.Clients.Group(userId.ToString()).SendAsync("ReceiveNotification", new
        {
            notification.Id,
            notification.Type,
            notification.Title,
            notification.Message,
            notification.IsRead,
            notification.Data,
            notification.CreatedAt,
        });
    }
}
