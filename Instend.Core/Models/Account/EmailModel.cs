using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

namespace Exider.Core.Models.Account
{
    public class EmailModel
    {

        [Column("email")][Key] public string Email { get; private set; } = null!;

        [Column("creation_time")] public DateTime CreationTime { get; private set; }

        [Column("is_confirmed")] public bool IsConfirmed { get; private set; }

        [Column("user_id")] public Guid UserId { get; private set; }

        private EmailModel() { }

        public static Result<EmailModel> Create(string email, bool isConfirmed, Guid userId)
        {

            if (Regex.IsMatch(email, @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$") == false)
            {
                return Result.Failure<EmailModel>("Invalid email address");
            }

            if (userId == Guid.Empty)
            {
                return Result.Failure<EmailModel>("Invalid user id");
            }

            EmailModel emailModel = new EmailModel()
            {
                Email = email,
                CreationTime = DateTime.Now,
                IsConfirmed = isConfirmed,
                UserId = userId
            };

            return Result.Success(emailModel);

        }

    }
}
