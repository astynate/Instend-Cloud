using Instend.Core.Dependencies.Services.Internal.Helpers;
using Microsoft.AspNetCore.SignalR;

namespace Instend.Server.Hubs
{
    public class JoinHubHelper
    {
        private readonly Hub _hub;

        private readonly ISerializationHelper _serializator;

        public JoinHubHelper(Hub hub, ISerializationHelper serializator)
        {
            _hub = hub;
            _serializator = serializator;
        }

        public async Task Join(string targetHandler, string connectionId, IEnumerable<string> groupNames, IEnumerable<object> objects)
        {
            foreach (var name in groupNames)
            {
                await _hub.Groups.AddToGroupAsync(connectionId, name);
            }

            await _hub.Clients.Caller.SendAsync(targetHandler, _serializator.SerializeWithCamelCase(objects));
        }
    }
}