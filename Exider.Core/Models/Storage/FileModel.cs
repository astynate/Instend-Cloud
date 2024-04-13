using CSharpFunctionalExtensions;
using Exider.Services.External.FileService;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Storage
{
    public class FileModel
    {
        [Column("id")][Key] public Guid Id { get; private set; }
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("last_edit_time")] public DateTime LastEditTime { get; private set; }
        [Column("path")] public string Path { get; private set; } = string.Empty;
        [Column("type")] public string? Type { get; private set; } = null;
        [Column("owner_id")] public Guid OwnerId { get; private set; }
        [Column("folder_id")] public Guid FolderId { get; private set; }
        [Column("access")] public string Access { get; private set; } = "private";

        [NotMapped] public byte[] FileAsBytes { get; private set; } = new byte[0];

        private FileModel() { }

        public static Result<FileModel> Create(string name, string? type, Guid ownerId, Guid folderId)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrEmpty(name))
            {
                return Result.Failure<FileModel>("Invalid folder name");
            }

            if (ownerId == Guid.Empty)
            {
                return Result.Failure<FileModel>("Invalid ownder id");
            }

            Guid id = Guid.NewGuid();

            return Result.Success(new FileModel()
            {
                Id = id,
                Name = name,
                OwnerId = ownerId,
                CreationTime = DateTime.Now,
                LastEditTime = DateTime.Now,
                Path = Configuration.SystemDrive + "__files__/" + id,
                Type = type,
                FolderId = folderId
            });
        }

        public void Rename (string name) => Name = (string.IsNullOrEmpty(name) == false && 
            string.IsNullOrWhiteSpace(name) == false) ? name : Name;

        public async Task<Result> SetPreview(IFileService fileService)
        {
            Dictionary<string[], Configuration.HandleFileCover> actions = new Dictionary<string[], Configuration.HandleFileCover>
            {
                { Configuration.imageTypes, PngHandler },
                { Configuration.documentTypes, DocumentHandlerAsync },
                { new string[] { "pdf" }, PdfHandlerAsync }
            };

            KeyValuePair<string[], Configuration.HandleFileCover> handler = actions
                .FirstOrDefault(pair => pair.Key.Contains(Type));

            if (handler.Value != null)
            {
                await handler.Value(fileService);
            }

            return Result.Success();
        }

        private async Task PngHandler(IFileService fileService)
        {
            var result = await fileService.ReadFileAsync(Path);

            if (result.IsFailure == false)
            {
                FileAsBytes = result.Value;
            }
        }

        private async Task DocumentHandlerAsync(IFileService fileService)
            => FileAsBytes = await fileService.GetWordDocumentPreviewImage(Path);

        private async Task PdfHandlerAsync(IFileService fileService)
            => FileAsBytes = await fileService.GetPdfPreviewImage(Path);
    }
}
