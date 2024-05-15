using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Access
{
    public class AccessItemBase
    {
        [Column("id")][Key] public Guid Id { get; protected set; }
        [Column("owner_id")] public Guid OwnerId { get; protected set; }
        [Column("access")] public string AccessId { get; protected set; } = Configuration.AccessTypes.Private.ToString();

        public AccessItemBase() { }

        [NotMapped]
        [EnumDataType(typeof(Configuration.AccessTypes))]
        public Configuration.AccessTypes Access
        {
            get => Enum.Parse<Configuration.AccessTypes>(AccessId);
            set => AccessId = value.ToString();
        }
    }
}