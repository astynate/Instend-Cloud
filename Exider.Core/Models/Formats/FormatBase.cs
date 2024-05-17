using CSharpFunctionalExtensions;
using Exider.Services.External.FileService;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Formats
{
    public abstract class FormatBase
    {
        [Column("file_id")][Key] public Guid FileId { get; protected set; } = Guid.Empty;

        public abstract Task SetMetaDataFromFile(IFileService service, byte[] file);
        public abstract bool DoesFormatBelongs(string format);

        public static async Task<Result<T>> Create<T>(IFileService fileService, Guid fileId, byte[] file) where T : FormatBase, new()
        {
            T result = new T { FileId = fileId };
            
            await result.SetMetaDataFromFile(fileService, file);

            return result;
        }
    }
}