using CSharpFunctionalExtensions;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Storage
{
    public class FolderModel
    {
        [Column("id")][Key] public Guid Id { get; private set; }
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("owner_id")] public Guid OwnerId { get; private set; }
        [Column("folder_id")] public Guid FolderId { get; private set; }
        [NotMapped] public List<FileModel> Preview { get; private set; } = new();
        [Column("access")] public Configuration.AccessTypes Access { get; private set; }

        private FolderModel() { }

        public static Result<FolderModel> Create(string name, Guid ownerId, Guid folderId)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrEmpty(name))
            {
                return Result.Failure<FolderModel>("Invalid folder name");
            }

            if (ownerId == Guid.Empty)
            {
                return Result.Failure<FolderModel>("Invalid ownder id");
            }

            return Result.Success(new FolderModel()
            {
                Id = Guid.NewGuid(),
                Name = name,
                OwnerId = ownerId,
                CreationTime = DateTime.Now,
                FolderId = folderId
            });
        }

        public async Task SetPreviewAsync (IFileService fileService, List<FileModel> preview)
        {
            foreach (var item in preview)
            {
                await item.SetPreview(fileService);
            }

            Preview = preview;
        }
    }
}