using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Abstraction
{
    public class AccessItemBase : DatabaseModel
    {
        [Column("account_id")] public Guid AccountId { get; protected set; }
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