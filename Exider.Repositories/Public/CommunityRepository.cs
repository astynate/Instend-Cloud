using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Links;
using Exider.Core.Models.Public;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Public
{
    public class CommunityRepository : ICommunityRepository
    {
        private readonly DatabaseContext _context = null!;

        private readonly IFileService _fileService = null!;

        private readonly IImageService _imageService = null!;

        public CommunityRepository(DatabaseContext context, IFileService fileService, IImageService imageService)
        {
            _context = context;
            _fileService = fileService;
            _imageService = imageService;
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

                community.SetAvatar(avatar.IsFailure ? string.Empty : 
                    Convert.ToBase64String(_imageService.ResizeImageToBase64(avatar.Value, 170)));
                
                community.SetHeader(header.IsFailure ? string.Empty : 
                    Convert.ToBase64String(_imageService.ResizeImageToBase64(header.Value, 350)));
            }

            return communities;
        }

        public async Task<Result<CommunityModel>> AddAsync(Guid userId, string name, string description, byte[] avatar, byte[] header)
        {
            if (avatar.Length <= 0)
                return Result.Failure<CommunityModel>("Invalid avatar");

            if (header.Length <= 0)
                return Result.Failure<CommunityModel>("Invalid header");

            Guid id = Guid.NewGuid();

            string avatarPath = Configuration.SystemDrive + $"__community_avatar__/{id}";
            string headerPath = Configuration.SystemDrive + $"__community_header__/{id}";

            var community = CommunityModel.Create(id, userId, name, description, avatarPath, headerPath);

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

        public async Task<CommunityModel?> GetCommunityById(Guid id)
        {
            CommunityModel? community = await _context.Communities
                .FirstOrDefaultAsync(x => x.Id == id);

            if (community != null)
            {
                var avatar = await _fileService.ReadFileAsync(community.Avatar);
                var header = await _fileService.ReadFileAsync(community.Header);

                community.SetAvatar(avatar.IsFailure ? string.Empty :
                    Convert.ToBase64String(_imageService.ResizeImageToBase64(avatar.Value, 170)));

                community.SetHeader(header.IsFailure ? string.Empty :
                    Convert.ToBase64String(_imageService.ResizeImageToBase64(header.Value, 350)));

                var communities = await _context.Communities
                                .OrderByDescending(x => x.Followers)
                                .Take(100)
                                .ToListAsync();

                var index = communities.FindIndex(x => x.Id == id);

                if (index >= 0)
                {
                    community.WorldWide = index + 1;
                }
            }

            return community;
        }

        public async Task<Result<CommunityModel>> UpdateAsync(Guid id, Guid userId, string? name, string? description, byte[] avatarBytes, byte[] headerBytes)
        {
            CommunityModel? community = await _context.Communities
                .FirstOrDefaultAsync(x => x.OwnerId == userId && x.Id == id);
                
            if (community == null)
                return Result.Failure<CommunityModel>("Community not found");

            var nameUpdateResult = community.UpdateName(name);

            if (nameUpdateResult.IsFailure)
                return Result.Failure<CommunityModel>(nameUpdateResult.Error);

            var descriptionUpdateResult = community.UpdateDescription(description);

            if (descriptionUpdateResult.IsFailure)
                return Result.Failure<CommunityModel>(descriptionUpdateResult.Error);

            if (avatarBytes != null && avatarBytes.Length > 0)
                await File.WriteAllBytesAsync(community.Avatar, avatarBytes);

            if (headerBytes != null && headerBytes.Length > 0)
                await File.WriteAllBytesAsync(community.Header, headerBytes);

            await _context.SaveChangesAsync();

            if (avatarBytes != null && avatarBytes.Length > 0)
                community.SetAvatar(Convert.ToBase64String(avatarBytes));
            else
                community.SetAvatar(Convert.ToBase64String(await File.ReadAllBytesAsync(community.Avatar)));

            if (headerBytes != null && headerBytes.Length > 0)
                community.SetHeader(Convert.ToBase64String(headerBytes));
            else
                community.SetHeader(Convert.ToBase64String(await File.ReadAllBytesAsync(community.Header)));

            return community;
        }

        public async Task<Result<bool>> FollowAsync(Guid id, Guid userId)
        {
            CommunityModel? model = await _context.Communities.FirstOrDefaultAsync(x => x.Id == id);

            if (model == null)
            {
                return Result.Failure<bool>("Community not found");
            }

            if (model != null && model.OwnerId == userId)
            {
                return Result.Failure<bool>("You cannot subscribe to your own community");
            }

            CommunityFollowerLink? link = await _context.CommunityFollowers
                .FirstOrDefaultAsync(x => x.ItemId == id && x.LinkedItemId == userId);

            if (link != null && model != null)
            {
                _context.Remove(link);
                _context.SaveChanges();

                model.DecrementFollowers();
                await _context.SaveChangesAsync();
                return false;
            }

            var result = LinkBase.Create<CommunityFollowerLink>(id, userId);

            if (result.IsFailure)
            {
                return Result.Failure<bool>(result.Error);
            }

            if (model != null)
            {
                model.IncrementFollowers();

                await _context.AddAsync(result.Value);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<Result<object[]>> GetFollowingIds(Guid userId)
        {
            return await _context.CommunityFollowers
                                 .Where(x => x.LinkedItemId == userId)
                                 .Select(x => new { id = x.ItemId })
                                 .ToArrayAsync();
        }
    }
}