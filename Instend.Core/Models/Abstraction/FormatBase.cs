using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Abstraction
{
    public abstract class FormatBase
    {
        [Column("file_id")][Key] public Guid FileId { get; protected set; } = Guid.Empty;

        public abstract void SetMetaDataFromFile(string type, string path);
        public abstract bool DoesFormatBelongs(string format);

        public static Result<T> Create<T>(Guid fileId, string type, string path) where T : FormatBase, new()
        {
            T result = new T { FileId = fileId };

            result.SetMetaDataFromFile(type, path);

            return result;
        }
    }
}