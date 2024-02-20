using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Email;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Email
{
    public class ConfirmationRespository : IConfirmationRespository
    {

        private readonly DatabaseContext _context = null!;

        private readonly IValidationService _validationService;

        private readonly IEncryptionService _encryptionService;

        public ConfirmationRespository(DatabaseContext context, IValidationService validationService, IEncryptionService encryptionService)
        {
            _context = context;
            _validationService = validationService;
            _encryptionService = encryptionService;
        }

        public async Task<Result<ConfirmationModel>> GetByLinkAsync(string link)
        {
            ConfirmationModel? confirmation = await _context.Confirmation.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Link == Guid.Parse(link));

            if (confirmation is null)
            {
                return Result.Failure<ConfirmationModel>("Confirmation not found");
            }

            if (DateTime.Now > confirmation.EndTime)
            {
                await DeleteAsync(confirmation);
                return Result.Failure<ConfirmationModel>("Link has expired");
            }

            return Result.Success(confirmation);
        }

        public async Task AddAsync(ConfirmationModel confirmation)
        {
            if (confirmation is null)
                throw new ArgumentNullException(nameof(confirmation));

            if (_validationService.ValidateEmail(confirmation.Email) == false)
                throw new ArgumentException("Invalid Email");

            if (_validationService.ValidateVarchar(confirmation.Code, 6) == false)
                throw new ArgumentException("Invalid Confirmation Code");

            await _context.Confirmation.Where(x => x.Email == confirmation.Email)
                .ExecuteDeleteAsync();

            await _context.Confirmation.AddAsync(confirmation);
            await _context.SaveChangesAsync();
        }

        public async Task<Result> DeleteAsync(ConfirmationModel confirmation)
        {
            if (confirmation is null) return Result.Failure("Confirmation cannot be null");

            await _context.Confirmation.AsNoTracking().Where(x => x.Link == confirmation.Link).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result<ConfirmationModel>> UpdateByLinkAsync(IEncryptionService encryptionService, string link)
        {
            if (string.IsNullOrEmpty(link) || string.IsNullOrWhiteSpace(link))
                return Result.Failure<ConfirmationModel>("Invalid link");

            ConfirmationModel? confirmationModel = await _context.Confirmation
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

    }

}
