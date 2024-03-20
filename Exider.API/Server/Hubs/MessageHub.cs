using Microsoft.AspNetCore.SignalR;

namespace Exider_Version_2._0._0.Server.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendMessage(string message)
        {
            await Console.Out.WriteLineAsync("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
