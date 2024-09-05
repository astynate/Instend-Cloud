using Exider.Core.Models.Access;
using Exider.Core.Models.Account;

namespace Exider.Core.TransferModels
{
    public class AccessTransferModel
    {
        public AccessTransferModel(AccessBase? access, UserModel? user, UserDataModel? data)
        {
            this.access = access;
            this.user = user;
            this.data = data;
        }

        public AccessBase? access { get; set; }
        public UserModel? user { get; set; }
        public UserDataModel? data { get; set; }
        public string? base64Avatar { get; set; } = string.Empty;
    }
}