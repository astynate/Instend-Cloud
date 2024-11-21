using Instend.Core.Models.Account;
using Instend.Core.Models.Abstraction;

namespace Instend.Core.TransferModels.Access
{
    public class AccessTransferModel
    {
        public AccessTransferModel(AccessBase? access, AccountModel? user)
        {
            this.access = access;
            this.user = user;
        }

        public AccessBase? access { get; set; }
        public AccountModel? user { get; set; }
        public string? base64Avatar { get; set; } = string.Empty;
    }
}