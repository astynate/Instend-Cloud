using CSharpFunctionalExtensions;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Email;
using Instend.Repositories.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Account
{
    public class ConfirmationsRespository : IConfirmationsRepository
    {
        private readonly GlobalContext _context = null!;

        private readonly IValidationService _validationService;

        private readonly IEncryptionService _encryptionService;

        public ConfirmationsRespository
        (
            GlobalContext context, 
            IValidationService validationService, 
            IEncryptionService encryptionService
        )
        {
            _context = context;
            _validationService = validationService;
            _encryptionService = encryptionService;
        }

        public async Task<Result<AccountConfirmation>> GetByLinkAsync(Guid link)
        {
            var confirmation = await _context.Confirmations.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Link == link);

            if (confirmation == null)
                return Result.Failure<AccountConfirmation>("Confirmation not found");

            if (DateTime.Now < confirmation.EndTime)
                return Result.Success(confirmation);

            await DeleteAsync(confirmation);
            
            return Result.Failure<AccountConfirmation>("Link has expired");
        }

        public async Task<Result> AddAsync(AccountConfirmation confirmation)
        {
            AccountConfirmation? confirmationModel = await _context.Confirmations
                .AsNoTracking().FirstOrDefaultAsync(x => x.Email == confirmation.Email);

            if (confirmationModel != null && confirmationModel.CreationTime.AddMinutes(1) >= DateTime.Now)
                return Result.Failure("Confirmation has already been created");

            await _context.Confirmations
                .Where(x => x.Email == confirmation.Email)
                .ExecuteDeleteAsync();

            await _context.Confirmations.AddAsync(confirmation);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result> DeleteAsync(AccountConfirmation confirmation)
        {
            if (confirmation is null) 
                return Result.Failure("Confirmation cannot be null");

            await _context.Confirmations
                .AsNoTracking()
                .Where(x => x.Link == confirmation.Link)
                .ExecuteDeleteAsync();

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result<AccountConfirmation>> UpdateByLinkAsync(IEncryptionService encryptionService, string link)
        {
            if (string.IsNullOrEmpty(link) || string.IsNullOrWhiteSpace(link))
                return Result.Failure<AccountConfirmation>("Invalid link");

            AccountConfirmation? confirmationModel = await _context.Confirmations
                .FirstOrDefaultAsync(x => x.Link == Guid.Parse(link) && x.CreationTime.AddMinutes(1) <= DateTime.Now);

            if (confirmationModel == null)
                return Result.Failure<AccountConfirmation>("Confirmation not found");

            confirmationModel.Update(encryptionService);
            _context.Entry(confirmationModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Result.Success(confirmationModel);
            }
            catch (DbUpdateException ex)
            {
                return Result.Failure<AccountConfirmation>($"Failed to update confirmation: {ex.Message}");
            }
        }

        public async Task<Result<AccountConfirmation>> GetByEmailAsync(string email)
        {
            AccountConfirmation? confirmation = await _context.Confirmations.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Email == email);

            if (confirmation == null)
                return Result.Failure<AccountConfirmation>("Confirmation not found");

            if (DateTime.Now > confirmation.EndTime)
            {
                await DeleteAsync(confirmation);
                return Result.Failure<AccountConfirmation>("Link has expired");
            }

            return Result.Success(confirmation);
        }

        public Task ConfirmEmailAddressAsync(string email)
        {
            throw new NotImplementedException();
        }
    }
}