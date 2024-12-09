﻿using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using CSharpFunctionalExtensions;
using Instend.Core.Models.Public;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Publications;
using Instend.Core.Models.Storage.File;
using Microsoft.AspNetCore.Http;

namespace Instend.Repositories.Comments
{
    public class PublicationsRepository : IPublicationsRepository
    {
        private readonly PublicationsContext _publicationsContext;

        private readonly IFileService _fileService;

        public PublicationsRepository
        (
            PublicationsContext publicationsContext,
            IFileService fileService
        )
        {
            _publicationsContext = publicationsContext;
            _fileService = fileService;
        }

        private async Task AddAttachment(IFormFile file, Publication publication, Core.Models.Account.Account account)
        {
            var attachment = Attachment.Create(file, account.Id);

            if (attachment.IsFailure)
                return;

            publication.Attachments.Add(attachment.Value);

            await _fileService
                .SaveIFormFile(file, attachment.Value.Path);
        }

        public async Task<Result<Publication>> AddAsync(PublicationTransferModel publicationTransferModel, Core.Models.Account.Account account)
        {
            var publication = Publication.Create(publicationTransferModel.text, account.Id);

            if (publication.IsFailure)
                return publication;

            foreach (var file in publicationTransferModel.files ?? []) 
            {
                await AddAttachment(file, publication.Value, account);
            }

            try
            {
                await _publicationsContext.AddAsync(publication.Value);
                await _publicationsContext.SaveChangesAsync();
            }
            catch (Exception exception)
            {
                foreach (var attachment in publication.Value.Attachments)
                {
                    if (System.IO.File.Exists(attachment.Path))
                    {
                        System.IO.File.Delete(attachment.Path);
                    }
                }

                throw new Exception("An error occurred while adding the publication.", exception);
            }

            return publication;
        }

        public async Task<Publication?> GetByIdAsync(Guid id)
        {
            var publication = await _publicationsContext.Publications
                .AsNoTracking()
                .Where(c => c.Id == id)
                .Include(x => x.Attachments)
                .Include(x => x.Account)
                .FirstOrDefaultAsync();

            return publication;
        }

        public async Task<bool> DeleteAsync(Guid id, Guid ownerId)
        {
            var result = await _publicationsContext.Publications
                .Where(p => p.Id == id && p.AccountId == ownerId)
                .ExecuteDeleteAsync();

            await _publicationsContext.SaveChangesAsync();

            return result > 0;
        }

        public async Task<List<Publication>> GetNewsByAccount(DateTime date, Core.Models.Account.Account account, int count)
        {
            var targetAccounts = account.Following
                .Concat([account])
                .Select(x => x.Id)
                .ToArray();

            var result = await _publicationsContext.Publications
                .OrderBy(x => x.Date)
                .Where(x => targetAccounts.Contains(x.AccountId) )
                .Include(x => x.Account)
                    .ThenInclude(x => x.Publications)
                .Include(x => x.Attachments)
                .Take(5)
                .ToListAsync();

            return result;
        }
    }
}