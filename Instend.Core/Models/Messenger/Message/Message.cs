using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage.Collection;
using Instend.Core.Models.Storage.File;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Messenger.Message
{
    [Table("Messages")]
    public class Message
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("text")] public string Text { get; private set; } = string.Empty;
        [Column("account_id")] public Guid AccountId { get; private set; }
        [Column("message_id")] public Guid ReplyToId { get; private set; }
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;
        [Column("is_viewed")] public bool IsViewed { get; set; } = false;

        public Account.Account? Sender { get; set; } = null;
        public Message? ReplyTo { get; set; } = null;

        public List<Attachment> Attachments { get; set; } = [];
        //public List<Collection> Folders { get; set; } = [];
        //public List<Storage.File.File> Files { get; set; } = [];

        private Message() { }

        public static Result<Message> Create(string text, Guid accountId)
        {
            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
                return Result.Failure<Message>("Please write a message");

            if (accountId == Guid.Empty)
                return Result.Failure<Message>("Account not found");

            return new Message()
            {
                Text = text,
                AccountId = accountId
            };
        }
    }
}