using Exider.Core.Models.Account;
using Exider.Core.Models.Storage;

namespace Exider.Core.TransferModels
{
    public class AccessTransferModel
    {
        public AccessTransferModel(FolderAccess? access, UserModel? user, UserDataModel? data)
        {
            this.access = access;
            this.user = user;
            this.data = data;
        }

        public FolderAccess? access { get; set; }
        public UserModel? user { get; set; }
        public UserDataModel? data { get; set; }
        public string? base64Avatar { get; set; } = string.Empty;
    }
}