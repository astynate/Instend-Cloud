using CSharpFunctionalExtensions;
using Instend.Services.External.FileService;
using Instend.Core.Models.Abstraction;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.Album
{
    [Table("albums")]
    public class Album : AccessItemBase, IDatabaseStorageRelation
    {
        [Column("name")] public string Name { get; private set; } = "Unknown";
        [Column("description")] public string? Description { get; private set; } = string.Empty;
        [Column("cover")] public string Cover { get; private set; } = Configuration.DefaultAlbumCoverPath;
        [Column("creation_time")] public DateTime CreationTime { get; private set; }
        [Column("last_edit_time")] public DateTime LastEditTime { get; private set; }
        [Column("type")] public string TypeId { get; private set; } = Configuration.AlbumTypes.Album.ToString();
        [Column("views")] public long Views { get; private set; } = 0;
        [Column("reactions")] public long Reactions { get; private set; } = 0;

        public List<AlbumAccount> AccountsWithAccess { get; init; } = [];

        public Album() { }

        [NotMapped]
        [EnumDataType(typeof(Configuration.AlbumTypes))]
        public Configuration.AlbumTypes Type
        {
            get => Enum.Parse<Configuration.AlbumTypes>(TypeId);
            set => TypeId = value.ToString();
        }

        public static Result<Album> Create(string name, string? description, Configuration.AlbumTypes type, Configuration.AccessTypes access)
        {
            var id = Guid.NewGuid();
            var cover = Configuration.GetAvailableDrivePath() + id.ToString();

            return new Album()
            {
                Id = id,
                Name = name,
                Description = description,
                Cover = cover,
                CreationTime = DateTime.Now,
                LastEditTime = DateTime.Now,
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

            LastEditTime = DateTime.Now;
            Description = description;
        }

        public void IncrementViews() => Views++;
        public void OnDelete(IFileService fileService) => fileService.DeleteFile(Cover);
    }
}