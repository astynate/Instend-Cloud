using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Abstraction
{
    public class DatabaseModelBase
    {
        [Column("id")] public Guid Id { get; protected set; } = Guid.NewGuid();
    }
}