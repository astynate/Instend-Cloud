using Microsoft.AspNetCore.SignalR;

namespace Exider_Version_2._0._0.Server.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendMessage(string message)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                try
                {
                    for (int i = 0; i < 3; i++)
                    {
                        HttpResponseMessage response = await httpClient.GetAsync($"http://localhost:8080?context={message}");
                        response.EnsureSuccessStatusCode();

                        string responseText = await response.Content.ReadAsStringAsync();
                        message += responseText;

                        await Clients.Caller.SendAsync("ReceiveMessage", new string[] { responseText, (i == 2).ToString() });
                    }
                }
                catch (HttpRequestException ex)
                {
                    Console.WriteLine($"An error occurred: {ex.Message}");
                    await Clients.Caller.SendAsync("ReceiveMessage", ".");
                }
            }
        }
    }
}