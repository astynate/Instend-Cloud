﻿using CSharpFunctionalExtensions;
using Instend.Core.Models.Public;
using Instend.Repositories.Publications;

namespace Instend.Core.Dependencies.Repositories.Account
{
    public interface IPublicationsRepository
    {
        Task<List<Publication>> GetNewsByAccount(DateTime date, Models.Account.Account account, int count);
        Task<Result<Publication>> AddAsync(PublicationTransferModel publicationTransferModel, Models.Account.Account account);
        Task<Result<Publication>> UpdateAsync(UpdatePublicationTransferModel publicationTransferModel, Models.Account.Account account);
        Task<bool> DeleteAsync(Guid id, Guid ownerId);
        Task<Publication?> GetByIdAsync(Guid id);
    }
}