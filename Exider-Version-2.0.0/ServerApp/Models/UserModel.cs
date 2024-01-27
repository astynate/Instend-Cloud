using Exider_Version_2._0._0.ServerApp.Services;

namespace Exider_Version_2._0._0.ServerApp.Models
{
    public class UserModel
    {

        public int id { get; private set; }
        public string name { get; private set; } = null!;
        public string surname { get; private set; } = null!;
        public string nickname { get; private set; } = null!;
        public string email { get; private set; } = null!;
        public string password { get; private set; } = null!;

        public string Name 
        {     
            set => name = ValidationService
                .ValidateVarchar(value, 45);
        }

        public string Surname
        {
            set => surname = ValidationService
                .ValidateVarchar(value, 45);
        }

        public string Nickname
        {
            set => nickname = ValidationService
                .ValidateVarchar(value, 45);
        }

        public string Password
        {
            set => password = EncryptionService
                .HashUsingSHA256(ValidationService
                .ValidateVarchar(value, 45));
        }

        public string Email 
        {
            get => email;
            set => email = ValidationService
                .ValidateEmail(value);
        }

    }

}
