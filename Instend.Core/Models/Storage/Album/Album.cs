using CSharpFunctionalExtensions;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Instend.Core.Models.Storage.File;

namespace Instend.Core.Models.Storage.Album
{
    [Table("albums")]
    public class Album : AccessItemBase
    {
        [Column("name")] public string Name { get; private set; } = "Not set";
        [Column("description")] public string? Description { get; private set; } = string.Empty;
        [Column("cover")] public string Cover { get; private set; } = Configuration.DefaultAlbumCoverPath;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("last_edit_time")] public DateTime LastEditTime { get; private set; }
        [Column("type")] public string TypeId { get; private set; } = Configuration.AlbumTypes.Album.ToString();
        [Column("views")] public long Views { get; private set; } = 0;
        [Column("reactions")] public long Reactions { get; private set; } = 0;

        public File.File

        public Album() { }

        [NotMapped]
        [EnumDataType(typeof(Configuration.AlbumTypes))]
        public Configuration.AlbumTypes Type
        {
            get => Enum.Parse<Configuration.AlbumTypes>(TypeId);
            set => TypeId = value.ToString();
        }

        public static Result<Album> Create
        (
            string name,
            string? description,
            DateTime creationTime,
            DateTime lastEditTime,
            Guid ownerId,
            Configuration.AlbumTypes type,
            Configuration.AccessTypes access
        )
        {
            Guid id = Guid.NewGuid();

            return new Album()
            {
                Id = id,
                Name = name,
                Description = description,
                Cover = Configuration.GetAvailableDrivePath() + id.ToString(),
                CreationTime = creationTime,
                LastEditTime = lastEditTime,
                AccountId = ownerId,
                Access = access,
                AccessId = access.ToString(),
                Type = type,
                TypeId = type.ToString()
            };
        }

        public async Task SetCover(IImageService imageService)
        {
            var result = await imageService.ReadImageAsBase64(Cover);

            if (result.IsFailure)
                return;

            var isEmpthy = result.Value == null || result.Value.Length < 1;
            var coverImage = isEmpthy ? Configuration.DefaultAlbumCover : result.Value;

            Cover = coverImage ?? "";
        }

        public void Update(string? name, string? description)
        {
            if (string.IsNullOrEmpty(name) == false && string.IsNullOrWhiteSpace(name) == false)
                Name = name;

            Description = description;
        }

        public void IncrementViews() => Views++;
    }
}