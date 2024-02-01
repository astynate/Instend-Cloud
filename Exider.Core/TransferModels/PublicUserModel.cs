using Exider_Version_2._0._0.ServerApp.Models;

namespace Exider_Version_2._0._0.ServerApp.TransferObjects
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
