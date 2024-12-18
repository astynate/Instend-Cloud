using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage.File;
using Instend.Core.TransferModels.Publication;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Public
{
    [Table("publications")]
    public class Publication
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("text")] public string Text { get; private set; } = string.Empty;
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;
        [Column("number_of_reactions")] public int NumberOfReactions { get; private set; } = 0;
        [Column("number_of_comments")] public int NumberOfComments { get; private set; } = 0;
        [Column("number_of_views")] public int NumberOfViews { get; private set; } = 0;
        [Column("account_id")] public Guid AccountId { get; private set; }
        [Column("publication_id")] public Guid? PublicationId { get; private set; }

        public Account.Account Account { get; set; } = null!;
        public List<Attachment> Attachments { get; set; } = new List<Attachment>();
        public List<PublicationReaction> Reactions { get; set; } = new List<PublicationReaction>();
        public List<Publication> Comments { get; set; } = new List<Publication>();
        
        [NotMapped] public List<GroupedReactions> GroupedReactions { get; set; } = new List<GroupedReactions>();

        [NotMapped] public static readonly int MaxLength = 1024;

        private Publication() { }

        public static Publication ExtendPublication(Publication publication, List<GroupedReactions> groupedReactions, int numberOfComments)
        {
            publication.GroupedReactions = groupedReactions;
            publication.NumberOfComments = numberOfComments;

            return publication;
        }

        public static Result<Publication> Create(string? text, Guid ownerId)
        {
            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
                return Result.Failure<Publication>("Invalid text");

            if (ownerId == Guid.Empty)
                return Result.Failure<Publication>("Invalid user id");

            return new Publication()
            {
                Text = text,
                AccountId = ownerId
            };
        }

        public static Result<Publication> Create(string? text, Guid ownerId, Guid publicationId)
        {
            var result = Create(text, ownerId);

            if (result.IsSuccess)
                result.Value.PublicationId = publicationId;

            return result;
        }

        public void SetText(string? text)
        {
            if (string.IsNullOrEmpty(text))
                return;

            if (text.Length > MaxLength)
                return;

            Text = text;
        }

        public void SetAttachment(List<Attachment> attachment) => Attachments = attachment;
        public void IncrementNumberOfReactions() => NumberOfReactions++;
        public void DecrementNumberOfReactions() => NumberOfReactions--;
    }
}