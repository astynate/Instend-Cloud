﻿using Instend.Services.External.FileService;
using Microsoft.EntityFrameworkCore;
using Instend.Repositories.Contexts;
using CSharpFunctionalExtensions;
using Instend.Core.Models.Public;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Repositories.Publications;
using Instend.Core.Models.Storage.File;
using Microsoft.AspNetCore.Http;
using Instend.Core;

namespace Instend.Repositories.Comments
{
    public class PublicationsRepository : IPublicationsRepository
    {
        private readonly GlobalContext _context;

        private readonly IFileService _fileService;

        private readonly IPreviewService _previewService;

        public PublicationsRepository
        (
            GlobalContext context,
            IFileService fileService,
            IPreviewService previewService
        )
        {
            _context = context;
            _fileService = fileService;
            _previewService = previewService;
        }

        private async Task AddAttachment(IFormFile file, Publication publication, Core.Models.Account.Account account)
        {
            List<string> availableTypes = [..Configuration.imageTypes, ..Configuration.videoTypes, ..Configuration.videoTypes];

            var attachment = Attachment.Create(file, account.Id);

            if (availableTypes.Contains(attachment.Value.Type ?? "") == false)
                return;

            if (attachment.IsFailure)
                return;

            publication.Attachments.Add(attachment.Value);

            await _fileService.SaveIFormFile(file, attachment.Value.Path);
            await publication.Attachments.Last().SetPreview(_previewService);
        }

        public async Task<Result<Publication>> AddAsync(PublicationTransferModel publicationTransferModel, Core.Models.Account.Account account)
        {
            var publication = Publication.Create(publicationTransferModel.text, account.Id);

            if (publication.IsFailure)
                return publication;

            foreach (var file in publicationTransferModel.attachments ?? []) 
            {
                await AddAttachment(file, publication.Value, account);
            }

            try
            {
                await _context.AddAsync(publication.Value);
                await _context.SaveChangesAsync();
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

            publication.Value.Account = account;

            return publication;
        }

        public async Task<Publication?> GetByIdAsync(Guid id)
        {
            var publication = await _context.Publications
                .Where(c => c.Id == id)
                .Include(x => x.Attachments)
                .Include(x => x.Account)
                .Include(x => x.Reactions)
                    .ThenInclude(x => x.Account)
                .Include(x => x.Reactions)
                    .ThenInclude(x => x.Reaction)
                .FirstOrDefaultAsync();

            return publication;
        }

        public async Task<object> GetNewsByAccount(DateTime date, Core.Models.Account.Account account, int count)
        {
            var targetAccounts = account.Following
                .Concat([account])
                .Select(x => x.Id)
                .ToArray();

            var result = await _context.Publications
                .OrderByDescending(x => x.Date)
                .Where(x => targetAccounts.Contains(x.AccountId) && x.Date < date)
                .Include(x => x.Account)
                    .ThenInclude(x => x.Publications)
                .Include(x => x.Attachments)
                .Select(p => new
                {
                    Publication = p,
                    GroupedReactions = p.Reactions
                        .GroupBy(r => r.ReactionId)
                        .Select(g => new
                        {
                            ReactionId = g.Key,
                            Count = g.Count(),
                            Reaction = g.FirstOrDefault()
                        })
                        .ToList()
                })
                .Take(5)
                .ToListAsync();

            foreach (var publication in result)
            {
                foreach (var attachment in publication.Publication.Attachments)
                {
                    await attachment.SetPreview(_previewService);
                }
            }

            return result;
        }

        public (List<(Attachment, IFormFile)> add, List<Attachment> remove) GetAttachementAsync(Publication publication, UpdatePublicationTransferModel publicationTransferModel)
        {
            if (publicationTransferModel.attachments == null)
                return (new List<(Attachment, IFormFile)>(), publication.Attachments);

            if (publicationTransferModel.attachments.Length == 0)
                return (new List<(Attachment, IFormFile)>(), publication.Attachments);

            var attachmentsToAdd = publicationTransferModel.attachments
                .Where(x => !publication.Attachments.Any(a => a.Id == x.id) && x.attachment != null)
                .Select(a => (Attachment.Create(a.attachment, publication.AccountId), a.attachment))
                .Where(a => a.Item1.IsSuccess)
                .Select(a => (a.Item1.Value, a.Item2))
                .ToList();

            var attachmentsToDelete = publication.Attachments
                .Where(x => !publicationTransferModel.attachments.Any(a => a.id == x.Id))
                .ToList();

            return (attachmentsToAdd, attachmentsToDelete);
        }

        public async Task<Result<Publication>> UpdateAsync(UpdatePublicationTransferModel publicationTransferModel, Core.Models.Account.Account account)
        {
            var publication = await _context.Publications
                .Where(c => c.Id == publicationTransferModel.id && c.AccountId == account.Id)
                .Include(x => x.Attachments)
                .Include(x => x.Account)
                .FirstOrDefaultAsync();

            if (publication == null) 
                return Result.Failure<Publication>("Publication was not found.");

            var attachments = GetAttachementAsync(publication, publicationTransferModel);

            if (attachments.add.Any())
            {
                foreach (var attachment in attachments.add)
                {
                    _context.Attachments.Add(attachment.Item1);
                    await _fileService.SaveIFormFile(attachment.Item2, attachment.Item1.Path);
                }

                await _context.SaveChangesAsync();
            }

            publication.SetText(publicationTransferModel.text);
            publication.Attachments.AddRange(attachments.add.Select(x => x.Item1));

            _context.RemoveRange(attachments.remove);

            await _context.SaveChangesAsync();

            return publication;
        }

        private async Task<PublicationReaction?> HandlerReactionExist(Publication publication, PublicationReaction reaction, Guid reactionId)
        {
            if (reaction.Reaction.Id == reactionId)
            {
                publication
                    .DecrementNumberOfReactions();

                _context.PublicationReactions
                    .Remove(reaction);

                await _context
                    .SaveChangesAsync();

                return null;
            }

            reaction.ReactionId = reactionId;
            await _context.SaveChangesAsync();

            return reaction;
        }

        public async Task<Result<PublicationReaction?>> ReactAsync(Guid publicationId, Guid accountId, Guid reactionId)
        {
            var publication = await GetByIdAsync(publicationId);

            if (publication == null)
                return Result.Failure<PublicationReaction?>("Publication not found");

            var exsitingReaction = await _context.PublicationReactions
                .FirstOrDefaultAsync(x => x.PublicationId == publicationId && x.AccountId == accountId);

            if (exsitingReaction != null)
                return await HandlerReactionExist(publication, exsitingReaction, reactionId);

            var reaction = await _context.Reactions
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == reactionId);

            if (reaction == null)
                return Result.Failure<PublicationReaction?>("This type of reaction was not found");

            var publicationReaction = new PublicationReaction();

            publicationReaction.Reaction = reaction;
            publicationReaction.Account = publication.Account;

            _context.Attach(publicationReaction);

            publication.Reactions.Add(publicationReaction);
            publication.IncrementNumberOfReactions();

            await _context.AddAsync(publicationReaction);
            await _context.SaveChangesAsync();

            return publicationReaction;
        }

        public async Task<bool> DeleteAsync(Guid id, Guid accountId)
        {
            var result = await _context.Publications
                .Where(x => x.Id == id && x.AccountId == accountId)
                .Include(x => x.Attachments)
                .FirstOrDefaultAsync();

            if (result == null)
                return false;

            _context.RemoveRange(result.Attachments);
            _context.Remove(result);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}