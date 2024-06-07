using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Storage
{
    [Table("attachments")]
    public class AttachmentModel
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("path")] public string Path { get; private set; } = string.Empty;
        [Column("type")] public string? Type { get; private set; } = string.Empty;
        [Column("size")] public ulong Size { get; private set; } = 0;
        [Column("userId")] public Guid UserId { get; private set; }

        private AttachmentModel() { }

        public static Result<AttachmentModel> Create(string name, string path, string? type, ulong size, Guid userId)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(name))
                return Result.Failure<AttachmentModel>("Invalid name");

            if (string.IsNullOrWhiteSpace(path) || string.IsNullOrWhiteSpace(path))
                return Result.Failure<AttachmentModel>("Invalid path");

            if (size < 0)
                return Result.Failure<AttachmentModel>("Invalid size");

            if (userId == Guid.Empty)
                return Result.Failure<AttachmentModel>("User not found");

            return new AttachmentModel()
            {
                Name = name,
                Path = path,
                Type = type,
                Size = size,
                UserId = userId
            };
        }
    }
}