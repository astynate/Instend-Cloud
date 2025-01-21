using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Abstraction
{
    public class DatabaseModel
    {
        [Column("id")][Key] public Guid Id { get; protected set; } = Guid.NewGuid();
    }
}