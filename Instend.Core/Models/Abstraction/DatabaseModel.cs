using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Abstraction
{
    public class DatabaseModel
    {
        [Column("id")] 
        public Guid Id { get; protected set; } = Guid.NewGuid();
    }
}