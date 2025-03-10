﻿using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Repositories.Storage;
using Microsoft.AspNetCore.Http;
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
                    return Result.Failure<byte[]>("Invalid Path");

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
            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }

        public async Task SaveIFormFile(IFormFile file, string path)
        {
            using (var stream = new MemoryStream())
            {
                file.CopyTo(stream);

                await File.WriteAllBytesAsync(path, stream.ToArray());
            }
        }

        public string ConvertSystemTypeToContentType(string? systemType)
        {
            if (string.IsNullOrEmpty(systemType) || string.IsNullOrWhiteSpace(systemType))
                return "";

            if (Configuration.imageTypes.Contains(systemType.ToLower()))
                return "image/" + systemType;

            return "application/" + systemType;
        }

        public async Task WriteFileAsync(string path, byte[] file) => await File.WriteAllBytesAsync(path, file);
        public async Task WriteFileAsync(string path, string? file) => await File.WriteAllTextAsync(path, file);
    }
}