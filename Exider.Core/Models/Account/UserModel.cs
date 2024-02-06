using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Account
{
    public class UserModel
    {

        [Column("id")][Key] public Guid Id { get; set; }

        [Column("name")] public string Name { get; set; } = null!;

        [Column("surname")] public string Surname { get; set; } = null!;

        [Column("nickname")] public string Nickname { get; set; } = null!;

        [Column("email")] public string Email { get; set; } = null!;

        [Column("storage_space")] public double StorageSpace { get; set; } = 1024;

        [Column("password")] public string Password { get; set; } = null!;

    }
}
