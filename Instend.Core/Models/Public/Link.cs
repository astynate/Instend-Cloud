using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Public
{
    [Table("links")]
    public class Link : DatabaseModel
    {
        [Column("name")] public string Name { get; private set; } = string.Empty;
    }
}