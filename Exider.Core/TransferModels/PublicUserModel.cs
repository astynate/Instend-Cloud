using Exider.Core.Models;

namespace Exider.Core.TransferModels
{
    public class PublicUserModel
    {

        public string? id { get; set; }
        public string? name { get; set; }
        public string? surname { get; set; }
        public string? nickname { get; set; }
        public string? email { get; set; }

        public PublicUserModel(UserModel user)
        {

            id = user.PublicId;
            name = user.Name;
            surname = user.Surname;
            nickname = user.Nickname;
            email = user.Email;

        }

    }

}
