using CSharpFunctionalExtensions;
using Instend.Core;
using Instend.Core.Dependencies.Repositories.Account;
using Instend.Core.Dependencies.Services.Internal.Services;
using Instend.Core.Models.Email;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Account
{
    public class ConfirmationsRespository : IConfirmationsRespository
    {
        private readonly DatabaseContext _context = null!;

        private readonly IValidationService _validationService;

        private readonly IEncryptionService _encryptionService;

        public ConfirmationsRespository
        (
            DatabaseContext context, 
            IValidationService validationService, 
            IEncryptionService encryptionService
        )
        {
            _context = context;
            _validationService = validationService;
            _encryptionService = encryptionService;
        }

        public async Task<Result<ConfirmationModel>> GetByLinkAsync(string link)
        {
            ConfirmationModel? confirmation = await _context.Confirmations.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Link == Guid.Parse(link));

            if (confirmation == null)
                return Result.Failure<ConfirmationModel>("Confirmation not found");

            if (DateTime.Now < confirmation.EndTime)
                return Result.Success(confirmation);

            await DeleteAsync(confirmation);
            
            return Result.Failure<ConfirmationModel>("Link has expired");
        }

        public async Task<Result> AddAsync(ConfirmationModel confirmation)
        {
            ConfirmationModel? confirmationModel = await _context.Confirmations
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

        public async Task<Result> DeleteAsync(ConfirmationModel confirmation)
        {
            if (confirmation is null) 
                return Result.Failure("Confirmation cannot be null");

            await _context.Confirmations.AsNoTracking()
                .Where(x => x.Link == confirmation.Link).ExecuteDeleteAsync();

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result<ConfirmationModel>> UpdateByLinkAsync(IEncryptionService encryptionService, string link)
        {
            if (string.IsNullOrEmpty(link) || string.IsNullOrWhiteSpace(link))
                return Result.Failure<ConfirmationModel>("Invalid link");

            ConfirmationModel? confirmationModel = await _context.Confirmations
                .FirstOrDefaultAsync(x => x.Link == Guid.Parse(link) && x.CreationTime.AddMinutes(1) <= DateTime.Now);

            if (confirmationModel == null)
                return Result.Failure<ConfirmationModel>("Confirmation not found");

            confirmationModel.Update(encryptionService);
            _context.Entry(confirmationModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Result.Success(confirmationModel);
            }
            catch (DbUpdateException ex)
            {
                return Result.Failure<ConfirmationModel>($"Failed to update confirmation: {ex.Message}");
            }
        }

        public async Task<Result<ConfirmationModel>> GetByEmailAsync(string email)
        {
            ConfirmationModel? confirmation = await _context.Confirmations.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Email == email);

            if (confirmation == null)
                return Result.Failure<ConfirmationModel>("Confirmation not found");

            if (DateTime.Now > confirmation.EndTime)
            {
                await DeleteAsync(confirmation);
                return Result.Failure<ConfirmationModel>("Link has expired");
            }

            return Result.Success(confirmation);
        }
    }
}