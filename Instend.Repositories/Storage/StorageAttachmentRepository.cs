using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;
using Exider.Services.Internal.Handlers;

namespace Instend.Repositories.Storage
{
    public class StorageAttachmentRepository
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

        public async Task<Result<FolderModel[]>> AddFolderLinks(Guid[] folderIds, string bearer)
        {
            var userId = _requestHandler.GetUserId(bearer);

            if (userId.IsFailure)
            {
                return Result.Failure<FolderModel[]>(userId.Error);
            }

            FolderModel[] folders = new FolderModel[folderIds.Length];

            for (int i = 0; i < folderIds.Length; i++)
            {
                //folders[i] = await _folderRepository.GetByIdAsync(folderIds[i], );
            }

            //await _accessHandler.GetAccessStateAsync();

            return folders;
        }
    }
}