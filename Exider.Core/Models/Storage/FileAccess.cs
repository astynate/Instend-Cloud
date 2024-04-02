using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Storage
{
    [Keyless]
    [Table("file_access")]
    public class FileAccess
    {
        [Column("file_id")] public Guid FileId { get; private set; }
        [Column("user_id")] public Guid UserId { get; private set; }

        public static Result<FileAccess> Create(Guid filerId, Guid userId)
        {
            if (filerId == Guid.Empty)
            {
                return Result.Failure<FileAccess>("Invalid folder id");
            }

            if (userId == Guid.Empty)
            {
                return Result.Failure<FileAccess>("Invalid user id");
            }

            return Result.Success(new FileAccess()
            {
                FileId = filerId,
                UserId = userId
            });
        }
    }
}
