using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Exider.Core.Models.Public
{
    [Table("communities")]
    public class CommunityModel
    {
        [Column("id")][Key] public Guid Id { get; private set; }
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("description")] public string Description { get; private set; } = string.Empty;
        [Column("followers")] public ulong Followers { get; private set; } = 0;
        [Column("publications")] public ulong Publications { get; private set; } = 0;
        [Column("avatar")] public string Avatar { get; private set; } = string.Empty;
        [Column("header")] public string Header { get; private set; } = string.Empty;

        private CommunityModel() { }

        public static Result<CommunityModel> Create(Guid id, string name, string description, string avatar, string header)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
                return Result.Failure<CommunityModel>("Name is required");

            if (string.IsNullOrEmpty(avatar) || string.IsNullOrWhiteSpace(avatar))
                return Result.Failure<CommunityModel>("Name is description");

            if (string.IsNullOrEmpty(header) || string.IsNullOrWhiteSpace(header))
                return Result.Failure<CommunityModel>("Name is description");

            return new CommunityModel()
            {
                Id = id,
                Name = name,
                Description = description,
                Avatar = avatar,
                Header = header
            };
        }
    }
}