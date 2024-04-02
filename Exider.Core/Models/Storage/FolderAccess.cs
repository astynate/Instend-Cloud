using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Storage
{
    [Keyless]
    [Table("folder_access")]
    public class FolderAccess
    {
        [Column("folder_id")] public Guid FolderId { get; private set; }
        [Column("user_id")] public Guid UserId { get; private set; }

        private FolderAccess() { }
        public static Result<FolderAccess> Create(Guid folderId,  Guid userId) 
        {
            if (folderId == Guid.Empty)
            {
                return Result.Failure<FolderAccess>("Invalid folder id");
            }

            if (userId == Guid.Empty)
            {
                return Result.Failure<FolderAccess>("Invalid user id");
            }

            return Result.Success(new FolderAccess()
            {
                FolderId = folderId,
                UserId = userId
            });
        }
    }
}
