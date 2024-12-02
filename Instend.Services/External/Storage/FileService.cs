using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Repositories.Storage;
using System.IO.Compression;

namespace Instend.Services.External.FileService
{
    public class FileService : IFileService
    {
        private static SemaphoreSlim _semaphoreSlim = new SemaphoreSlim(1, 1);

        public async Task<Result<byte[]>> ReadFileAsync(string path)
        {
            await _semaphoreSlim.WaitAsync();

            try
            {
                if (string.IsNullOrEmpty(path) || string.IsNullOrWhiteSpace(path))
                    return Result.Failure<byte[]>("Invalid path");

                if (System.IO.File.Exists(path) == false)
                    return Result.Failure<byte[]>("File not found");

                return await System.IO.File.ReadAllBytesAsync(path);
            }
            catch (Exception)
            {
                return Result.Failure<byte[]>("Cannot read fileToWrite");
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }

        private async Task DeleteFolderContent
        (
            ICollectionsRepository folderRepository,
            IFileRespository fileRespository,
            Guid id
        )
        {
            var files = await fileRespository.GetByFolderId(Guid.Empty, id);

            foreach (var file in files)
            {
                await fileRespository.Delete(file.Id);
            }

            await folderRepository.DeleteAsync(id);
        }

        public async Task DeleteFolderById
        (
            IFileRespository fileRespository,
            ICollectionsRepository folderRepository,
            IPreviewService preview,
            Guid id
        )
        {
            await DeleteFolderContent(folderRepository, fileRespository, id);

            var folders = await folderRepository
                .GetCollectionsByParentId(Guid.Empty, id);

            foreach (var folder in folders)
            {
                await DeleteFolderById(fileRespository, folderRepository, preview, folder.Id);
            }
        }

        public byte[] CreateZipFromFiles(Core.Models.Storage.File.File[] files)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    foreach (var file in files)
                    {
                        var fileToWrite = archive.CreateEntry($"{file.Name}.{file.Type}");

                        using (var entryStream = fileToWrite.Open())
                        {
                            var fileBytes = System.IO.File.ReadAllBytes(file.Path);
                            entryStream.Write(fileBytes, 0, fileBytes.Length);
                        }
                    }
                }

                return memoryStream.ToArray();
            }
        }

        public void DeleteFile(string path)
        {
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
        }

        public void SaveIFormFile()
        {

        }

        public string ConvertSystemTypeToContentType(string systemType)
        {
            if (Configuration.imageTypes.Contains(systemType.ToLower()))
                return "image/" + systemType;

            return "application/" + systemType;
        }

        public async Task WriteFileAsync(string path, byte[] file) => await System.IO.File.WriteAllBytesAsync(path, file);
    }
}