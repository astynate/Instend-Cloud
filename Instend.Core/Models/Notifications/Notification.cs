using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Notifications
{
    [Table("notifications")]
    public class Notification : DatabaseModel
    {
        [Column("text")] public string Text { get; init; } = string.Empty;

        public Account.Account? Account { get; set; } = null;
        
        private Notification() { }

        public static Result<Notification> Create(string text)
        {
            if (string.IsNullOrEmpty(text))
                return Result.Failure<Notification>("Text of notification must not be empthy");
            
            return new Notification() 
            { 
                Text = text 
            };
        }
    }
}