using Exider_Version_2._0._0.ServerApp.Services;
using Exider_Version_2._0._0.ServerApp.TransferObjects;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider_Version_2._0._0.ServerApp.Models
{
    public class UserModel
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        public uint id { get; set; }

        private string password;
        private string name;
        private string surname;
        private string nickname;
        private string email;

        public UserModel(string name, string surname, string nickname, string email, string password)
        {
            Name = name;
            Surname = surname;
            Nickname = nickname;
            Email = email;
            Password = password;
        }

        public UserModel(UserTransferModel userTransferModel)
        {
            Name = userTransferModel.name;
            Surname = userTransferModel.surname;
            Nickname = userTransferModel.nickname;
            Email = userTransferModel.email;
            Password = userTransferModel.password;
        }

        [NotMapped]
        public string PublicId
        {
            get => EncryptionService
                .GeneratePublicIdFromPrivate(id);
        }

        public string Name
        {
            get => name;
            set => name = ValidationService
                .ValidateVarchar(value, 45);
        }

        public string Surname
        {
            get => surname;
            set => surname = ValidationService
                .ValidateVarchar(value, 45);
        }

        public string Nickname
        {
            get => nickname;
            set => nickname = ValidationService
                .ValidateVarchar(value, 45);
        }

        public string Password
        {
            get => password;
            set => password = ValidationService
                .ValidateVarchar(value, 250);
        }

        public string Email
        {
            get => email;
            set => email = ValidationService
                .ValidateEmail(value);
        }

    }
}
