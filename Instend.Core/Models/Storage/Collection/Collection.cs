using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.Collection
{
    [Table("collections")]
    public class Collection : AccessItemBase
    {
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("creation_time")] public DateTime CreationTime { get; private set; } = DateTime.Now;
        [Column("collection_id")] public Guid? CollectionId { get; private set; } = null;
        [Column("type")] public string TypeId { get; private set; } = Configuration.CollectionTypes.Ordinary.ToString();

        public List<CollectionAccount> AccountsWithAccess { get; init; } = [];
        public Collection? ParentCollection { get; set; } = null;
        public List<Collection> Collections { get; set; } = [];
        public List<File.File> Files { get; set; } = [];

        [NotMapped]
        [EnumDataType(typeof(Configuration.CollectionTypes))]
        public Configuration.CollectionTypes Type
        {
            get => Enum.Parse<Configuration.CollectionTypes>(TypeId);
            set => TypeId = value.ToString();
        }

        private Collection() { }

        public static Result<Collection> Create(string name, Guid? collectionId, Configuration.CollectionTypes folderType)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrEmpty(name))
                return Result.Failure<Collection>("Invalid folder name");

            return Result.Success(new Collection()
            {
                Id = Guid.NewGuid(),
                Name = name,
                CreationTime = DateTime.Now,
                CollectionId = collectionId,
                Type = folderType
            });
        }
    }
}