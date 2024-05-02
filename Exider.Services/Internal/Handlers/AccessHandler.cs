using CSharpFunctionalExtensions;
using Exider.Core;
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

        public async Task<Result> GetAccessStateAsync(FileModel file, Configuration.Abilities operation, string bearer)
        {
            var userId = _requestHandler.GetUserId(bearer);

            if (userId.IsFailure)
                return Result.Failure("Invalid usser id");

            if (file.OwnerId == Guid.Parse(userId.Value))
                return Result.Success();

            if (file.Access == Configuration.AccessTypes.Private && Guid.Parse(userId.Value) != file.OwnerId)
            {
                bool folderAccess = file.FolderId != Guid.Empty ? await _folderAccessRepository
                    .GetUserAccess(Guid.Parse(userId.Value), file.FolderId) : false;

                if (folderAccess == false)
                {
                    return Result.Failure("You do not have access to the file or the containing folder");
                }
            }

            if (file.Access == Configuration.AccessTypes.Favorites)
            {
                bool fileAccess = await _fileAccessRepository.GetUserAccess(Guid.Parse(userId.Value), file.Id);

                bool folderAccess = file.FolderId != Guid.Empty ? await _folderAccessRepository
                    .GetUserAccess(Guid.Parse(userId.Value), file.FolderId) : false;

                if (fileAccess == false && folderAccess == false)
                {
                    return Result.Failure("You do not have access to the file or the containing folder");
                }
            }

            if (operation != Configuration.Abilities.Read && file.Access == Configuration.AccessTypes.Public)
                return Result.Failure("Files with public access available for rading only");

            return Result.Success();
        }

        public async Task<Result> GetAccessStateAsync(FolderModel folder, Configuration.Abilities operation, string bearer)
        {
            var userId = _requestHandler.GetUserId(bearer);

            if (folder.FolderType == Configuration.FolderTypes.System && operation != Configuration.Abilities.Read)
                return Result.Failure("You cannot perform this operation on the system folder.");

            if (userId.IsFailure)
                return Result.Failure("Invalid user id");

            if (folder.OwnerId == Guid.Parse(userId.Value))
                return Result.Success();

            if (folder.Access == Configuration.AccessTypes.Private && Guid.Parse(userId.Value) != folder.OwnerId)
                return Result.Failure("Only owner haves an access to private folder");

            if (folder.Access == Configuration.AccessTypes.Favorites && await _folderAccessRepository.GetUserAccess(Guid.Parse(userId.Value), folder.Id) == false)
                return Result.Failure("You are not in the list of users who have access to this folder");

            if (operation != Configuration.Abilities.Read && folder.Access == Configuration.AccessTypes.Public)
                return Result.Failure("Folders with public access available for rading only");

            return Result.Success();
        }
    }
}