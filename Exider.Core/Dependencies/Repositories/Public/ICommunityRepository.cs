using CSharpFunctionalExtensions;
using Exider.Core.Models.Public;

namespace Exider.Repositories.Public
{
    public interface ICommunityRepository
    {
        Task<Result<CommunityModel>> AddAsync(string name, string description, byte[] avatar, byte[] header);
        Task<CommunityModel[]> GetPopularCommunitiesAsync(int from, int count);
        Task<CommunityModel?> GetCommunityById(Guid id);
    }
}