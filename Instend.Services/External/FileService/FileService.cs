using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Storage;
using Exider.Repositories.Storage;
using System.IO.Compression;

namespace Exider.Services.External.FileService
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

                if (File.Exists(path) == false)
                    return Result.Failure<byte[]>("File not found");

                return await File.ReadAllBytesAsync(path);
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
            IFolderRepository folderRepository,
            IFileRespository fileRespository,
            Guid id
        )
        {
            FileModel[] files = await fileRespository
                .GetByFolderId(Guid.Empty, id);

            foreach (FileModel file in files)
            {
                await fileRespository.Delete(file.Id);
            }

            await folderRepository.Delete(id);
        }

        public async Task DeleteFolderById
        (
            IFileRespository fileRespository,
            IFolderRepository folderRepository,
            IPreviewService preview,
            Guid id
        )
        {
            await DeleteFolderContent(folderRepository, fileRespository, id);

            FolderModel[] folders = await folderRepository
                .GetFoldersByFolderId(preview, Guid.Empty, id);

            foreach (FolderModel folder in folders)
            {
                await DeleteFolderById(fileRespository, folderRepository, preview, folder.Id);
            }
        }

        public byte[] CreateZipFromFiles(FileModel[] files)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    foreach (var file in files)
                    {
                        ZipArchiveEntry fileToWrite = archive.CreateEntry($"{file.Name}.{file.Type}");

                        try
                        {
                            using (var entryStream = fileToWrite.Open())
                            {
                                byte[] fileBytes = File.ReadAllBytes(file.Path);
                                entryStream.Write(fileBytes, 0, fileBytes.Length);
                            }

                        } catch { }
                    }
                }

                return memoryStream.ToArray();
            }
        }

        public string ConvertSystemTypeToContentType(string systemType)
        {
            if (Configuration.imageTypes.Contains(systemType.ToLower()))
            {
                return "image/" + systemType;
            }

            return "application/" + systemType;
        }

        public async Task WriteFileAsync(string path, byte[] file) => await File.WriteAllBytesAsync(path, file);
    }
}