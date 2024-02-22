using CSharpFunctionalExtensions;
using Exider_Version_2._0._0.ServerApp.Services;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

namespace Exider.Core.Models.Account
{
    public class UserModel
    {

        [Column("id")][Key] public Guid Id { get; private set; }

        [Column("name")] public string Name { get; private set; } = null!;

        [Column("surname")] public string Surname { get; private set; } = null!;

        [Column("nickname")] public string Nickname { get; private set; } = null!;

        [Column("email")] public string Email { get; private set; } = null!;

        [Column("password")] public string Password { get; private set; } = null!;

        private UserModel() { }

        public static Result<UserModel> Create (string name, string surname, string nickname, string email, string password)
        {

            Func<string, bool> ValidateVarchar = (x)
                => !(string.IsNullOrEmpty(x) || x.Length > 45 || string.IsNullOrWhiteSpace(x));

            if (Regex.IsMatch(email, @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$") == false)
                return Result.Failure<UserModel>("Invalid email address");

            if (ValidateVarchar(name) == false)
                return Result.Failure<UserModel>("Invalid name");

            if (ValidateVarchar(surname) == false)
                return Result.Failure<UserModel>("Invalid surname");

            if (ValidateVarchar(nickname) == false)
                return Result.Failure<UserModel>("Invalid nickname");

            if (ValidateVarchar(password) == false || password.Length < 8)
                return Result.Failure<UserModel>("Invalid nickname");

            UserModel user = new UserModel()
            {
                Name = name,
                Surname = surname,
                Nickname = nickname,
                Email = email,
                Password = password,
            };

            return Result.Success(user);

        }

        public void HashPassword(IEncryptionService encryptionService) 
            => Password = encryptionService.HashUsingSHA256(Password);

        public Result RecoverPassword(IEncryptionService encryptionService, string password)
        {
            if (password.Length < 8 || string.IsNullOrWhiteSpace(password))
                return Result.Failure("Invalid password");

            Password = password;
            HashPassword(encryptionService);

            return Result.Success();
        }

    }
}