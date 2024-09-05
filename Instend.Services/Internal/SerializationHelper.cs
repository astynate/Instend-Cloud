using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;

namespace Exider.Services.Internal
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