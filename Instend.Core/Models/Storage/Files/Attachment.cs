﻿using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;
using Instend.Services.External.FileService;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace Instend.Core.Models.Storage.File
{
    [Table("attachments")]
    public class Attachment : DatabaseModel, IDatabaseStorageRelation
    {
        [Column("account_id")] public Guid AccountId { get; private set; }
        [Column("name")] public string Name { get; private set; } = string.Empty;
        [Column("Path")] public string Path { get; private set; } = string.Empty;
        [Column("type")] public string? Type { get; private set; } = string.Empty;
        [Column("size")] public long Size { get; private set; } = 0;

        private Attachment() {}

        public static Result<Attachment> Create(string name, string? type, long size, Guid userId)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(name))
                return Result.Failure<Attachment>("Invalid name");

            if (size < 0)
                return Result.Failure<Attachment>("Invalid size");

            if (userId == Guid.Empty)
                return Result.Failure<Attachment>("User not found");

            var id = Guid.NewGuid();
            var path = Configuration.GetAvailableDrivePath() + id;

            return new Attachment()
            {
                Id = id,
                Name = name,
                Path = path,
                Type = type,
                Size = size,
                AccountId = userId
            };
        }

        public static Result<Attachment> Create(IFormFile file, Guid accountId)
        {
            if (string.IsNullOrWhiteSpace(file.FileName) || string.IsNullOrWhiteSpace(file.FileName))
                return Result.Failure<Attachment>("Invalid name");

            if (file.Length < 0)
                return Result.Failure<Attachment>("Invalid size");

            if (accountId == Guid.Empty)
                return Result.Failure<Attachment>("User not found");

            var id = Guid.NewGuid();
            var name = file.FileName.Split('.');
            var type = name.Length >= 2 ? name[name.Length - 1] : "";
            var path = Configuration.GetAvailableDrivePath() + id + $".{type}";

            return new Attachment()
            {
                Id = id,
                Name = name[0],
                Path = path,
                Type = type,
                Size = file.Length,
                AccountId = accountId
            };
        }

        public void OnDelete(IFileService fileService) => fileService.DeleteFile(Path);
    }
}