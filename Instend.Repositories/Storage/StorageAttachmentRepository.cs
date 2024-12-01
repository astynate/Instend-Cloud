using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Repositories.Storage;
using Instend.Services.Internal.Handlers;
using Instend.Core.Models.Abstraction;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using Instend.Core.Models.Messenger.Message;
using Instend.Core.Models.Storage.File;
using Instend.Core.Models.Storage.Collection;

namespace Instend.Repositories.Storage
{
    public class StorageAttachmentRepository : IStorageAttachmentRepository
    {
        private readonly AccountsContext _context;

        private readonly IAccessHandler _accessHandler;

        private readonly IRequestHandler _requestHandler;

        private readonly IFolderRepository _folderRepository;

        private readonly IFileRespository _fileRepository;

        public StorageAttachmentRepository
        (
            AccountsContext context,
            IAccessHandler accessHandler,
            IFolderRepository folderRepository,
            IFileRespository fileRepository,
            IRequestHandler requestHandler
        )
        {
            _context = context;
            _accessHandler = accessHandler;
            _folderRepository = folderRepository;
            _fileRepository = fileRepository;
            _requestHandler = requestHandler;
        }

        public async Task<Result<(Collection[] folders, Core.Models.Storage.File.File[] files)>> AddStorageMessageLinks
        (
            Guid[] folderIds,
            Guid[] fileIds,
            Guid messageId,
            string bearer
        )
        {
            var userId = _requestHandler.GetUserId(bearer);

            if (userId.IsFailure)
                return Result.Failure<(Collection[] folders, File[] files)>(userId.Error);

            Collection[] folders = new Collection[folderIds.Length];
            Core.Models.Storage.File.File[] files = new Core.Models.Storage.File.File[fileIds.Length];

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    for (int i = 0; i < folderIds.Length; i++)
                    {
                        var folder = await _folderRepository
                            .GetByIdAsync(folderIds[i], Guid.Parse(userId.Value));

                        if (folder == null)
                            return Result.Failure<(Collection[] folders, File[] files)>("Folder not found");

                        var access = await _accessHandler.GetAccessStateAsync(folder,
                            Configuration.Abilities.Write, bearer);

                        if (access.IsFailure)
                            return Result.Failure<(Collection[] folders, File[] files)>("You don't have access to this file.");

                        var link = LinkBase.Create<MessageCollection>(messageId, folder.Id);

                        if (link.IsFailure)
                            return Result.Failure<(Collection[] folders, File[] files)>(link.Error);

                        await _context.AddAsync(link.Value); folders[i] = folder;
                    }

                    for (int i = 0; i < fileIds.Length; i++)
                    {
                        var file = await _fileRepository.GetByIdAsync(fileIds[i]);

                        if (file.IsFailure)
                            return Result.Failure<(Collection[] folders, File[] files)>(file.Error);

                        var access = await _accessHandler.GetAccessStateAsync(file.Value,
                            Configuration.Abilities.Write, bearer);

                        if (access.IsFailure)
                            return Result.Failure<(Collection[] folders, File[] files)>("You don't have access to this file.");

                        var link = LinkBase.Create<MessageFile>(messageId, file.Value.Id);

                        if (link.IsFailure)
                            return Result.Failure<(Collection[] folders, File[] files)>(link.Error);

                        await _context.AddAsync(link.Value); files[i] = file.Value;
                    }

                    await _context.SaveChangesAsync(); transaction.Commit(); return (folders, files);
                }
            });
        }
    }
}