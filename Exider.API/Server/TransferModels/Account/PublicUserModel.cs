using Exider.Core.Models.Account;

namespace Exider.Core.TransferModels.Account
{
    public class PublicUserModel
    {

        public Guid id { get; set; }
        public string? name { get; set; }
        public string? surname { get; set; }
        public string? nickname { get; set; }

        public PublicUserModel(UserModel user)
        {

            id = user.Id;
            name = user.Name;
            surname = user.Surname;
            nickname = user.Nickname;

        }

    }

}
