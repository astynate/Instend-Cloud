using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Comments
{
    [Table("comments")]
    public class CommentModel
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("text")] public string Text { get; private set; } = string.Empty;
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;
        [Column("owner_id")] public Guid OwnerId { get; private set; }

        private CommentModel() { }

        public static Result<CommentModel> Create(string text, Guid ownerId)
        {
            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
            {
                return Result.Failure<CommentModel>("Invalid text");
            }

            if (ownerId == Guid.Empty)
            {
                return Result.Failure<CommentModel>("Invalid user id");
            }

            return new CommentModel()
            {
                Text = text,
                OwnerId = ownerId
            };
        }
    }
}
