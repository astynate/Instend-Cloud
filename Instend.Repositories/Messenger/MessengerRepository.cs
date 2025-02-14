using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Messenger.Message;
using Instend.Core.TransferModels.Messenger;
using Instend.Services.External.FileService;
using Instend.Core.Models.Storage.File;

namespace Instend.Repositories.Messenger
{
    public class MessengerRepository : IMessengerRepository
    {
        private readonly GlobalContext _context = null!;

        public MessengerRepository(GlobalContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteMessage(Guid id, Guid accountId)
        {
            return await _context.Messages
                .AsNoTracking()
                .Where(x => x.Id == id && x.AccountId == accountId)
                .ExecuteDeleteAsync() > 0;
        }

        public async Task<bool> ViewMessage(Guid messageId, Guid userId)
        {
            var result = await _context.Messages
                .Where(x => x.Id == messageId && x.AccountId != userId)
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsViewed, true));

            return result != 0;
        }

        public async Task<Result<Message>> CreateMessage(IFileService fileService, MessageTransferModel message, Guid senderId)
        {
            var messageModel = Message.Create(message.text, senderId);

            if (messageModel.IsFailure)
                return Result.Failure<Message>(messageModel.Error);

            List<Attachment> attachments = [];

            try
            {
                if (message.files != null && message.files.Length > 0)
                {
                    var files = await _context.Files
                        .Where(x => message.files.Contains(x.Id))
                        .ToArrayAsync();

                    messageModel.Value.Files.AddRange(files);
                }
                else if (message.collections != null && message.collections.Length > 0)
                {
                    var collections = await _context.Collections
                        .Where(x => message.collections.Contains(x.Id))
                        .ToArrayAsync();

                    messageModel.Value.Collections.AddRange(collections);
                }
                else if (message.attachments != null && message.attachments.Length > 0)
                {
                    foreach (var attachment in message.attachments)
                    {
                        var value = Attachment.Create(attachment, senderId);

                        if (value.IsSuccess)
                        {
                            await _context.AddAsync(value.Value);

                            attachments.Add(value.Value);
                            await fileService.SaveIFormFile(attachment, value.Value.Path);
                        }
                    }

                    messageModel.Value.Attachments.AddRange(attachments);
                }

                await _context.AddAsync(messageModel.Value);
                await _context.SaveChangesAsync();
            }
            catch (Exception exception) 
            {
                Console.WriteLine(exception);

                foreach (var attachment in attachments)
                {
                    System.IO.File.Delete(attachment.Path);
                }
            }

            return messageModel.Value;
        }
    }
}