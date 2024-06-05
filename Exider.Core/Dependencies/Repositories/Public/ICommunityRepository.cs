using CSharpFunctionalExtensions;
using Exider.Core.Models.Public;

namespace Exider.Repositories.Public
{
    public interface ICommunityRepository
    {
        Task<Result<CommunityModel>> AddAsync(Guid userId, string name, string description, byte[] avatar, byte[] header);
        Task<CommunityModel[]> GetPopularCommunitiesAsync(int from, int count);
        Task<CommunityModel?> GetCommunityById(Guid id);
        Task<Result<CommunityModel>> UpdateAsync(Guid id, Guid userId, string? name, string? description, byte[] avatarBytes, byte[] headerBytes);
    }
}