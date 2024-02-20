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

        public ConfirmationRespository(DatabaseContext context, IValidationService validationService)
        {
            _context = context;
            _validationService = validationService;
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

            if (confirmation == null)
                throw new ArgumentNullException(nameof(confirmation));

            if (_validationService.ValidateEmail(confirmation.Email) == false)
                throw new ArgumentException("Invalid Email");

            if (_validationService.ValidateVarchar(confirmation.Code, 6) == false)
                throw new ArgumentException("Invalid Confirmation Code");

            ConfirmationModel? confirmationFromDB = _context.Confirmation
                .AsNoTracking().FirstOrDefault(c => c.Email == confirmation.Email);

            if (confirmationFromDB == null)
            {
                await _context.AddAsync(confirmation);
            }

            else
            {
                await _context.Confirmation.Where(c => c.Email == confirmation.Email)
                    .ExecuteUpdateAsync(c => c
                        .SetProperty(p => p.Link, Guid.NewGuid())
                        .SetProperty(p => p.Code, confirmation.Code)
                        .SetProperty(p => p.EndTime, confirmation.EndTime)
                        .SetProperty(p => p.UserId, confirmation.UserId));
            }

            await _context.SaveChangesAsync();

        }

        public async Task<Result> DeleteAsync(ConfirmationModel confirmation)
        {

            if (confirmation is null) return Result.Failure("Confirmation cannot be null");

            await _context.Confirmation.AsNoTracking().Where(x => x.Link == confirmation.Link).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();

            return Result.Success();

        }

        public async Task<Result<ConfirmationModel>> UpdateByLinkAsync(string link)
        {

            if (string.IsNullOrEmpty(link) || string.IsNullOrWhiteSpace(link))
            {
                return Result.Failure<ConfirmationModel>("Invalid link");
            }

            ConfirmationModel? confirmationModel = await _context.Confirmation.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Link == Guid.Parse(link) && x.CreationTime.AddMinutes(1) <= DateTime.Now);

            if (confirmationModel is null)
            {
                return Result.Failure<ConfirmationModel>("Confirmation not found");
            }

            confirmationModel.CreationTime = DateTime.Now;
            confirmationModel.Link = Guid.NewGuid();
            confirmationModel.Code = 

            return Result.Success(newLink.ToString());
        }
    }

}
