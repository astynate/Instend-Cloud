using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Public
{
    [Table("publications")]
    public class PublicationModel
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("text")] public string Text { get; private set; } = string.Empty;
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;
        [Column("likes")] public uint Likes { get; private set; } = 0;
        [Column("comments")] public uint Comments { get; private set; } = 0;
        [Column("views")] public uint Views { get; private set; } = 0;
        [Column("owner_id")] public Guid OwnerId { get; private set; }

        [NotMapped] public AttachmentModel[] attechments { get; set; } = new AttachmentModel[0];
        [NotMapped] public bool IsLiked { get; set; } = false;

        private PublicationModel() { }

        public static Result<PublicationModel> Create(string text, Guid ownerId)
        {
            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
                return Result.Failure<PublicationModel>("Invalid text");

            if (ownerId == Guid.Empty)
                return Result.Failure<PublicationModel>("Invalid user id");

            return new PublicationModel()
            {
                Text = text,
                OwnerId = ownerId
            };
        }

        public void SetAttachment(AttachmentModel[] attachment) 
            => attechments = attachment;

        public void IncrementLikes() => Likes++;
        public void DecrementLikes() => Likes--;
    }
}