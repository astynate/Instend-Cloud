using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Messages
{
    [Table("messages")]
    public class MessageModel
    {
        [Column("id")][Key] public Guid Id { get; set; } = Guid.NewGuid();
        [Column("text")] public string Text { get; set; } = string.Empty;
        [Column("user_id")] public Guid UserId { get; set; }

        private MessageModel() { }

        public static Result<MessageModel> Create(string text, Guid userId)
        {
            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
            {
                return Result.Failure<MessageModel>("Please write a message");
            }

            if (userId == Guid.Empty)
            {
                return Result.Failure<MessageModel>("User not found");
            }

            return new MessageModel()
            {
                Text = text,
                UserId = userId
            };
        }
    }
}