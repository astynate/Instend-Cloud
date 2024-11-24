using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Services.Internal.Services;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

namespace Instend.Core.Models.Email
{
    [Table("confirmations")]
    public class ConfirmationModel
    {
        [Column("link")][Key] public Guid Link { get; private set; }
        [Column("user_id")] public Guid UserId { get; private set; }
        [Column("email")] public string Email { get; private set; } = null!;
        [Column("code")] public string Code { get; private set; } = null!;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("end_time")] public DateTime EndTime { get; private set; }

        private ConfirmationModel () { }

        public static Result<ConfirmationModel> Create(string email, string code, Guid userId)
        {
            if (Regex.IsMatch(email, @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$") == false)
                return Result.Failure<ConfirmationModel>("Invalid email address");

            if (string.IsNullOrEmpty(code) || string.IsNullOrWhiteSpace(code) || code.Length != 6)
                return Result.Failure<ConfirmationModel>("Invalid confirmation code");

            if (userId == Guid.Empty)
                return Result.Failure<ConfirmationModel>("Invalid user id");

            ConfirmationModel confirmationModel = new ConfirmationModel()
            {
                Email = email,
                Code = code,
                CreationTime = DateTime.Now,
                EndTime = DateTime.Now.AddHours(Configuration.confirmationLifeTimeInHours),
                UserId = userId
            };

            return Result.Success(confirmationModel);
        }

        public void Update(IEncryptionService encryptionService)
        {
            Code = encryptionService.GenerateSecretCode(6);
            CreationTime = DateTime.Now;
            EndTime = DateTime.Now.AddHours(Configuration.confirmationLifeTimeInHours);
        }

        public void UpdateWithLink(IEncryptionService encryptionService)
        {
            Link = Guid.NewGuid();
            Update(encryptionService);
        }
    }
}