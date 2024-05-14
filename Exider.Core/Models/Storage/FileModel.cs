using CSharpFunctionalExtensions;
using Exider.Core.Models.Access;
using Exider.Services.External.FileService;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Storage
{
    public class FileModel : AccessItemBase
    {
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("last_edit_time")] public DateTime LastEditTime { get; private set; }
        [Column("path")] public string Path { get; private set; } = string.Empty;
        [Column("type")] public string? Type { get; private set; } = null;
        [Column("folder_id")] public Guid FolderId { get; private set; }
        [Column("size")] public double Size { get; private set; } = 0;

        [NotMapped] public byte[] FileAsBytes { get; private set; } = new byte[0];

        public FileModel() { }

        public static Result<FileModel> Create(string name, string? type, double size, Guid ownerId, Guid folderId)
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
                Size = size,
                Path = Configuration.SystemDrive + "__files__/" + id,
                Type = type,
                FolderId = folderId
            });
        }

        public void Rename (string name) => Name = (string.IsNullOrEmpty(name) == false && 
            string.IsNullOrWhiteSpace(name) == false) ? name : Name;

        public async Task<Result> SetPreview(IFileService fileService)
        {
            if (Type == null)
            {
                return Result.Success();
            }

            Dictionary<string[], Configuration.HandleFileCover> actions = new Dictionary<string[], Configuration.HandleFileCover>
            {
                { Configuration.imageTypes, PngHandler },
                { Configuration.documentTypes, DocumentHandlerAsync },
                { new string[] { "pdf" }, PdfHandlerAsync }
            };

            KeyValuePair<string[], Configuration.HandleFileCover> handler = actions
                .FirstOrDefault(pair => pair.Key.Contains(Type.ToLower()));

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
            => FileAsBytes = fileService.GetWordDocumentPreviewImage(Path);

        private async Task PdfHandlerAsync(IFileService fileService)
            => FileAsBytes = fileService.GetPdfPreviewImage(Path);
    }
}
