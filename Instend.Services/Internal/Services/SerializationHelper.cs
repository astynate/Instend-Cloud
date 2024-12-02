using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using Instend.Core.Dependencies.Services.Internal.Helpers;

namespace Instend.Services.Internal.Services
{
    public class SerializationHelper : ISerializationHelper
    {
        public string SerializeWithCamelCase(object obj)
        {
            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            return JsonConvert.SerializeObject(obj, serializerSettings);
        }
    }
}