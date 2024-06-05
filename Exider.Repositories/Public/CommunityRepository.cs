using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Public;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Exider.Repositories.Public
{
    public class CommunityRepository : ICommunityRepository
    {
        private readonly DatabaseContext _context = null!;

        private readonly IFileService _fileService = null!;

        public CommunityRepository(DatabaseContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<CommunityModel[]> GetPopularCommunitiesAsync(int from, int count)
        {
            CommunityModel[] communities = await _context.Communities
                .AsNoTracking()
                .OrderByDescending(x => x.Followers)
                .Skip(from)
                .Take(count)
                .ToArrayAsync();

            foreach (CommunityModel community in communities)
            {
                var avatar = await _fileService.ReadFileAsync(community.Avatar);
                var header = await _fileService.ReadFileAsync(community.Header);

                community.SetAvatar(avatar.IsFailure ? string.Empty : Convert.ToBase64String(avatar.Value));
                community.SetHeader(header.IsFailure ? string.Empty : Convert.ToBase64String(header.Value));
            }

            return communities;
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

            var community = CommunityModel.Create(id, name, description, avatarPath, headerPath);

            if (community.IsFailure)
            {
                return Result.Failure<CommunityModel>(community.Error);
            }

            await _context.AddAsync(community.Value);
            await _context.SaveChangesAsync();

            await File.WriteAllBytesAsync(avatarPath, avatar);
            await File.WriteAllBytesAsync(headerPath, header);

            return community.Value;
        }
    }
}