using Exider.Core.TransferModels;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Exider.Core.Models
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
            get => id.ToString();
        }

        public string Name
        {
            get => name;
            set => name = value;
        }

        public string Surname
        {
            get => surname;
            set => surname = value;
        }

        public string Nickname
        {
            get => nickname;
            set => nickname = value;
        }

        public string Password
        {
            get => password;
            set => password = value;
        }

        public string Email
        {
            get => email;
            set => email = value;
        }

    }
}
