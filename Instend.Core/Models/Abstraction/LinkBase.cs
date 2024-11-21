using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Comments;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Abstraction
{
    public class LinkBase : ILinkBase
    {
        [Column("id")][Key] public Guid Id { get; protected set; } = Guid.NewGuid();
        [Column("item_id")] public Guid ItemId { get; protected set; }
        [Column("linked_item_id")] public Guid LinkedItemId { get; protected set; }

        public LinkBase() { }

        public static Result<T> Create<T>(Guid itemId, Guid linkedItemId) where T : LinkBase, new()
        {
            if (linkedItemId == Guid.Empty)
            {
                return Result.Failure<T>("Invalid id");
            }

            if (itemId == Guid.Empty)
            {
                return Result.Failure<T>("Invalid id");
            }

            return new T()
            {
                ItemId = itemId,
                LinkedItemId = linkedItemId
            };
        }
    }
}