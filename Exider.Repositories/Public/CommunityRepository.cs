using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Public;

namespace Exider.Repositories.Public
{
    public class CommunityRepository : ICommunityRepository
    {
        private readonly DatabaseContext _context = null!;

        public CommunityRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<CommunityModel>> AddAsync(string name, string description, byte[] avatar, byte[] header)
        {
            if (avatar.Length <= 0)
                return Result.Failure<CommunityModel>("Invalid avatar");

            if (header.Length <= 0)
                return Result.Failure<CommunityModel>("Invalid header");

            Guid id = Guid.NewGuid();

            string avatarPath = Configuration.SystemDrive + $"__community_avatar__/{id}";
            string headerPath = Configuration.SystemDrive + $"__community_header__/{id}";

            await File.WriteAllBytesAsync(avatarPath, avatar);
            await File.WriteAllBytesAsync(headerPath, header);

            var community = CommunityModel.Create(id, name, description, avatarPath, headerPath);

            if (community.IsFailure)
            {
                return Result.Failure<CommunityModel>(community.Error);
            }

            await _context.AddAsync(community.Value);
            await _context.SaveChangesAsync();

            return community.Value;
        }
    }
}