using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Account;
using Exider.Core.TransferModels.Account;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Account
{
    public class UserDataRepository : IUserDataRepository
    {
        private readonly DatabaseContext _context = null!;

        private readonly IFileService _fileService = null!;

        public UserDataRepository(DatabaseContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task AddAsync(UserDataModel userData)
        {
            await _context.AddAsync(userData);
            await _context.SaveChangesAsync();
        }

        public async Task<Result<UserPublic>> GetUserAsync(Guid id)
        {
            UserPublic? userModel = _context.Users
                .Join(
                    _context.UserData,
                    user => user.Id,
                    data => data.UserId,
                    (user, data) => new UserPublic
                    {
                        Name = user.Name,
                        Surname = user.Surname,
                        Nickname = user.Nickname,
                        Email = user.Email,
                        Avatar = data.Avatar,
                        Header = data.Header,
                        Description = data.Description,
                        StorageSpace = data.StorageSpace,
                        Balance = data.Balance,
                        FriendCount = data.FriendCount
                    }
                )
                .FirstOrDefault();

            if (userModel is null)
            {
                return Result.Failure<UserPublic>("User not found");
            }

            if (userModel.Avatar == Configuration.DefaultAvatarPath)
            {
                userModel.Avatar = Configuration.DefaultAvatar;
            }
            else if (string.IsNullOrEmpty(userModel.Avatar) == false)
            {
                var avatarReadingResult = await _fileService.ReadFileAsync(userModel.Avatar);

                if (avatarReadingResult.IsFailure)
                {
                    return Result.Failure<UserPublic>("Cannon read avatar");
                }

                userModel.Avatar = Convert.ToBase64String(avatarReadingResult.Value);
            }

            if (string.IsNullOrEmpty(userModel.Header) == false)
            {
                var headerReadingResult = await _fileService.ReadFileAsync(userModel.Header);

                if (headerReadingResult.IsFailure)
                {
                    return Result.Failure<UserPublic>("Cannon read header");
                }

                userModel.Header = Convert.ToBase64String(headerReadingResult.Value);
            }

            return Result.Success(userModel);
        }

        public async Task UpdateAvatarAsync(Guid userId, string avatarPath)
        {
            await _context.UserData.AsNoTracking()
                .Where(u => u.UserId == userId)
                    .ExecuteUpdateAsync(user => user
                        .SetProperty(p => p.Avatar, avatarPath));

            await _context.SaveChangesAsync();
        }

        public async Task UpdateHeaderAsync(Guid userId, string headerPath)
        {
            await _context.UserData.AsNoTracking()
                .Where(u => u.UserId == userId)
                    .ExecuteUpdateAsync(user => user
                        .SetProperty(p => p.Header, headerPath));

            await _context.SaveChangesAsync();
        }
    }
}
