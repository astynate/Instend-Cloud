using Exider.Core;
using Exider.Core.TransferModels;
using Exider.Core.TransferModels.Account;
using Exider.Services.External.FileService;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Messenger
{
    public class MessengerReposiroty : IMessengerReposiroty
    {
        private readonly DatabaseContext _context = null!;

        public MessengerReposiroty(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<MessengerTransferModel[]> GetDirects(IFileService fileService, Guid userId)
        {
            MessengerTransferModel[] directs = await _context.Directs
                .Where(direct => direct.UserId == userId || direct.OwnerId == userId)
                .Join(_context.Users,
                    direct => (direct.OwnerId == userId ? direct.UserId : direct.OwnerId),
                    user => user.Id,
                    (direct, user) => new
                    {
                        direct,
                        user
                    })
                .Join(_context.UserData,
                    prev => prev.user.Id,
                    userData => userData.UserId,
                    (prev, userData) => new
                    {
                        prev.direct,
                        prev.user,
                        userData
                    })
                .GroupJoin(_context.DirectLinks,
                    prev => prev.direct.Id,
                    link => link.ItemId,
                    (prev, links) => new
                    {
                        prev,
                        link = links.OrderByDescending(l => l.Date).FirstOrDefault()
                    })
                .Join(_context.Messages,
                    prev => prev.link.LinkedItemId,
                    message => message.Id,
                    (prev, message) => 
                        new MessengerTransferModel
                        (
                            prev.prev.direct, 
                            message,
                            new UserPublic()
                            {
                                Id = prev.prev.user.Id,
                                Name = prev.prev.user.Name,
                                Surname = prev.prev.user.Surname,
                                Nickname = prev.prev.user.Nickname,
                                Email = prev.prev.user.Email,
                                Avatar = prev.prev.userData.Avatar,
                                Header = prev.prev.userData.Header,
                                Description = prev.prev.userData.Description,
                                StorageSpace = prev.prev.userData.StorageSpace,
                                OccupiedSpace = prev.prev.userData.OccupiedSpace,
                                Balance = prev.prev.userData.Balance,
                                FriendCount = prev.prev.userData.FriendCount
                            }
                        ))
                .ToArrayAsync();

            foreach (var direct in directs)
            {
                if (direct.userPublic.Avatar == null)
                {
                    direct.userPublic.Avatar = Configuration.DefaultAvatar;
                } 
                else
                {
                    var avatar = await fileService.ReadFileAsync(direct.userPublic.Avatar);

                    if (avatar.IsSuccess)
                    {
                        direct.userPublic.Avatar = Convert.ToBase64String(avatar.Value);
                    }
                    else
                    {
                        direct.userPublic.Avatar = Configuration.DefaultAvatar;
                    }
                }
            }

            return directs;
        }
    }
}