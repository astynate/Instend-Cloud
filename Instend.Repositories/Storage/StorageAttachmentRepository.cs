using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Models.Storage;
using Instend.Repositories.Storage;
using Instend.Services.Internal.Handlers;
using Instend.Core.Models.Abstraction;
using Instend.Core.Models.Links;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Storage
{
    public class StorageAttachmentRepository : IStorageAttachmentRepository
    {
        private readonly DatabaseContext _context;

        private readonly IAccessHandler _accessHandler;

        private readonly IRequestHandler _requestHandler;

        private readonly IFolderRepository _folderRepository;

        private readonly IFileRespository _fileRepository;

        public StorageAttachmentRepository
        (
            DatabaseContext context,
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

        public async Task<Result<(FolderModel[] folders, FileModel[] files)>> AddStorageMessageLinks
        (
            Guid[] folderIds,
            Guid[] fileIds,
            Guid messageId,
            string bearer
        )
        {
            var userId = _requestHandler.GetUserId(bearer);

            if (userId.IsFailure)
                return Result.Failure<(FolderModel[] folders, FileModel[] files)>(userId.Error);

            FolderModel[] folders = new FolderModel[folderIds.Length];
            FileModel[] files = new FileModel[fileIds.Length];

            return await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    for (int i = 0; i < folderIds.Length; i++)
                    {
                        var folder = await _folderRepository
                            .GetByIdAsync(folderIds[i], Guid.Parse(userId.Value));

                        if (folder == null)
                            return Result.Failure<(FolderModel[] folders, FileModel[] files)>("Folder not found");

                        var access = await _accessHandler.GetAccessStateAsync(folder,
                            Configuration.Abilities.Write, bearer);

                        if (access.IsFailure)
                            return Result.Failure<(FolderModel[] folders, FileModel[] files)>("You don't have access to this file.");

                        var link = LinkBase.Create<FolderMessageLink>(messageId, folder.Id);

                        if (link.IsFailure)
                            return Result.Failure<(FolderModel[] folders, FileModel[] files)>(link.Error);

                        await _context.AddAsync(link.Value); folders[i] = folder;
                    }

                    for (int i = 0; i < fileIds.Length; i++)
                    {
                        var file = await _fileRepository.GetByIdAsync(fileIds[i]);

                        if (file.IsFailure)
                            return Result.Failure<(FolderModel[] folders, FileModel[] files)>(file.Error);

                        var access = await _accessHandler.GetAccessStateAsync(file.Value,
                            Configuration.Abilities.Write, bearer);

                        if (access.IsFailure)
                            return Result.Failure<(FolderModel[] folders, FileModel[] files)>("You don't have access to this file.");

                        var link = LinkBase.Create<FileMessageLink>(messageId, file.Value.Id);

                        if (link.IsFailure)
                            return Result.Failure<(FolderModel[] folders, FileModel[] files)>(link.Error);

                        await _context.AddAsync(link.Value); files[i] = file.Value;
                    }

                    await _context.SaveChangesAsync(); transaction.Commit(); return (folders, files);
                }
            });
        }
    }
}