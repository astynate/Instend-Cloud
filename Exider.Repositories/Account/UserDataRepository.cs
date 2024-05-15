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
            UserPublic? userModel = await _context.Users
                .Where(user => user.Id == id)
                .Join(
                    _context.UserData,
                    user => user.Id,
                    data => data.UserId,
                    (user, data) => new UserPublic
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Surname = user.Surname,
                        Nickname = user.Nickname,
                        Email = user.Email,
                        Avatar = data.Avatar,
                        Header = data.Header,
                        Description = data.Description,
                        StorageSpace = data.StorageSpace,
                        Balance = data.Balance,
                        OccupiedSpace = data.OccupiedSpace,
                        FriendCount = data.FriendCount
                    }
                )
                .FirstOrDefaultAsync();

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

        public async Task<UserPublic[]> GetUsersbyPrefixAsync(string prefix)
        {
            UserPublic[] users = await _context.Users
                .Where(user => user.Nickname.Contains(prefix) ||
                               user.Name.Contains(prefix) ||
                               user.Surname.Contains(prefix))
                .Join(
                    _context.UserData,
                    user => user.Id,
                    data => data.UserId,
                    (user, data) => new UserPublic
                    {
                        Id = user.Id,
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
                ).ToArrayAsync();

            foreach (var user in users)
            {
                if (user.Avatar == Configuration.DefaultAvatarPath)
                {
                    user.Avatar = Configuration.DefaultAvatar;
                }
                else if (string.IsNullOrEmpty(user.Avatar) == false)
                {
                    var avatarReadingResult = await _fileService.ReadFileAsync(user.Avatar);

                    if (avatarReadingResult.IsFailure)
                    {
                        return new UserPublic[0];
                    }

                    user.Avatar = Convert.ToBase64String(avatarReadingResult.Value);
                }
            }

            return users;
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

        public async Task<Result<UserDataModel>> IncreaseOccupiedSpace(Guid userId, double amountInBytes)
        {
            UserDataModel? user = await _context.UserData
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return Result.Failure<UserDataModel>("User not found");
            }
            
            var result = user.IncreaseOccupiedSpace(amountInBytes);

            if (result.IsFailure)
            {
                return Result.Failure<UserDataModel>(result.Error);
            }

            await _context.SaveChangesAsync(); return Result.Success(user);
        }

        public async Task<Result<UserDataModel>> DecreaseOccupiedSpace(Guid userId, double amountInBytes)
        {
            UserDataModel? user = await _context.UserData
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return Result.Failure<UserDataModel>("User not found");
            }

            user.DecreaseOccupiedSpace(amountInBytes);
            
            await _context.SaveChangesAsync();
            return Result.Success(user);
        }
    }
}
