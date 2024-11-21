using CSharpFunctionalExtensions;
using Instend.Services.External.FileService;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage
{
    [Table("attachments")]
    public class AttachmentModel
    {
        [Column("id")][Key] public Guid Id { get; private set; }
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("path")] public string Path { get; private set; } = string.Empty;
        [Column("type")] public string? Type { get; private set; } = string.Empty;
        [Column("size")] public long Size { get; private set; } = 0;
        [Column("userId")] public Guid UserId { get; private set; }

        [NotMapped] public byte[] Preview { get; set; } = new byte[0];

        private AttachmentModel() { }

        public static Result<AttachmentModel> Create(string name, string? type, long size, Guid userId)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(name))
                return Result.Failure<AttachmentModel>("Invalid name");

            if (size < 0)
                return Result.Failure<AttachmentModel>("Invalid size");

            if (userId == Guid.Empty)
                return Result.Failure<AttachmentModel>("User not found");

            var id = Guid.NewGuid();
            var path = Configuration.GetAvailableDrivePath() + id;

            return new AttachmentModel()
            {
                Id = id,
                Name = name,
                Path = path,
                Type = type,
                Size = size,
                UserId = userId
            };
        }

        public async Task<Result> SetFile(IPreviewService previewService)
        {
            var result = await previewService.GetPreview(Type, Path);

            if (result.IsFailure)
            {
                return result;
            }

            Preview = result.Value; return Result.Success();
        }
    }
}