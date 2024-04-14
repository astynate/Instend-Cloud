using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;

namespace Exider.Services.Internal.Handlers
{
    public class AccessHandler : IAccessHandler
    {
        private readonly IRequestHandler _requestHandler;

        private readonly IFolderAccessRepository _folderAccessRepository;

        private readonly IFileAccessRepository _fileAccessRepository;

        public AccessHandler
        (
            IRequestHandler requestHandler,
            IFolderAccessRepository folderAccessRepository,
            IFileAccessRepository fileAccessRepository
        )
        {
            _requestHandler = requestHandler;
            _folderAccessRepository = folderAccessRepository;
            _fileAccessRepository = fileAccessRepository;
        }

        public async Task<bool> GetAccessStateAsync(FileModel file, string bearer)
        {
            var userId = _requestHandler.GetUserId(bearer);

            if (userId.IsFailure)
            {
                return false;
            }

            if (file.Access == "public")
                return true;

            if (file.Access == "private" && Guid.Parse(userId.Value) != file.OwnerId)
                return false;

            if (file.Access == "favorites" && await _fileAccessRepository.GetUserAccess(Guid.Parse(userId.Value), file.Id))
                return false;

            return true;
        }

        public async Task<bool> GetAccessStateAsync(FolderModel folder, string bearer)
        {
            var userId = _requestHandler.GetUserId(bearer);

            if (userId.IsFailure)
            {
                return false;
            }

            if (folder.Access == "public")
                return true;

            if (folder.Access == "private" && Guid.Parse(userId.Value) != folder.OwnerId)
                return false;

            if (folder.Access == "favorites" && await _folderAccessRepository.GetUserAccess(Guid.Parse(userId.Value), folder.Id))
                return false;

            return true;
        }
    }
}
