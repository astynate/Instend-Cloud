using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Access;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

namespace Instend.Core.Models.Account
{
    [Table("accounts")]
    public class Account
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("name")] public string Name { get; private set; } = null!;
        [Column("surname")] public string Surname { get; private set; } = null!;
        [Column("nickname")] public string Nickname { get; private set; } = null!;
        [Column("email")] public string Email { get; private set; } = null!;
        [Column("avatar")] public string Avatar { get; set; } = string.Empty;
        [Column("description")] public string? Description { get; set; } = string.Empty;
        [Column("balance")] public decimal Balance { get; private set; } = 0;
        [Column("password")] public string Password { get; private set; } = null!;
        [Column("storage_space")] public double StorageSpace { get; private set; } = 1073741824;
        [Column("occupied_space")] public double OccupiedSpace { get; private set; } = 0;
        [Column("is_confirmed")] public bool IsConfirmed { get; private set; } = false;
        [Column("creation_datetime")] public DateTime RegistrationDate { get; private set; } = DateTime.Now;
        [Column("date_of_birth")] public DateOnly DateOfBirth { get; private set; }
        [Column("friend_count")] public uint FriendCount { get; private set; } = 0;

        [NotMapped] public List<Account> Followers { get; set; } = new List<Account>();
        [NotMapped] public List<Account> Following { get; set; } = new List<Account>();
        [NotMapped] public List<AccountLink> Links { get; set; } = new List<AccountLink>();
        public List<CollectionAccount> Collections { get; set; } = new List<CollectionAccount>();
        public List<FileAccount> Files { get; set; } = new List<FileAccount>();
        public List<AlbumAccount> Albums { get; set; } = new List<AlbumAccount>();
        public List<Public.Publication> Publications { get; set; } = new List<Public.Publication>();

        private Account() { }

        public static Result<Account> Create (string name, string surname, string nickname, string email, string password, DateOnly dateOfBirth)
        {
            Func<string, bool> ValidateVarchar = (x)
                => !(string.IsNullOrEmpty(x) || x.Length > 45 || string.IsNullOrWhiteSpace(x));

            if (Regex.IsMatch(email, @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$") == false)
                return Result.Failure<Account>("Invalid email address");

            if (ValidateVarchar(name) == false)
                return Result.Failure<Account>("Invalid name");

            if (ValidateVarchar(surname) == false)
                return Result.Failure<Account>("Invalid surname");

            if (ValidateVarchar(nickname) == false)
                return Result.Failure<Account>("Invalid nickname");

            if (ValidateVarchar(password) == false || password.Length < 8)
                return Result.Failure<Account>("Invalid nickname");

            if (DateTime.Now.Year - dateOfBirth.Year < 5)
                return Result.Failure<Account>("To register an account in Instend you should be more than 5 years old.");

            var account = new Account();

            account.Name = name;
            account.Surname = surname;
            account.Nickname = nickname;
            account.Email = email;
            account.DateOfBirth = dateOfBirth;
            account.Password = password;
            account.Avatar = Configuration.GetAvailableDrivePath() + account.Id + "-avatar";

            return Result.Success(account);
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

        public Result UpdateData(string name, string surname, string nickname)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
                return Result.Failure("Name required");

            if (string.IsNullOrEmpty(surname) || string.IsNullOrWhiteSpace(surname))
                return Result.Failure("Surname required");

            if (string.IsNullOrEmpty(nickname) || string.IsNullOrWhiteSpace(nickname))
                return Result.Failure("Nickname required");

            Name = name;
            Surname = surname;
            Nickname = nickname;

            return Result.Success();
        }

        public Result<double> UpdateOccupiedSpaceValue(double amountInBytes)
        {
            var result = OccupiedSpace + amountInBytes;

            if (result > StorageSpace)
                return Result.Failure<double>("Not enough space to perform this operation.");

            OccupiedSpace = Math.Max(0, result);
            return OccupiedSpace;
        }

        public void IncrementFriendCount() => FriendCount++;
        public void DecrementFriendCount() => FriendCount--;
        public void ConfirmAccount() => IsConfirmed = true;
    }
}