using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Models.Account;
using Exider_Version_2._0._0.ServerApp.Services;
using Microsoft.EntityFrameworkCore;

namespace Exider.Repositories.Account
{
    public class EmailRepository : IEmailRepository
    {

        private readonly DatabaseContext _context = null!;

        private readonly IValidationService _validationService;

        public EmailRepository(DatabaseContext context, IValidationService validationService)
        {
            _context = context;
            _validationService = validationService;
        }

        public async Task<Result<EmailModel>> GetByEmailAsync(string email)
        {

            if (_validationService.ValidateEmail(email) == false)
            {
                return Result.Failure<EmailModel>("Invalid email");
            }

            EmailModel? emailModel = await _context.Email.AsNoTracking()
                .FirstOrDefaultAsync(e => e.Email == email);

            if (emailModel == null)
            {
                return Result.Failure<EmailModel>("Email address not found");
            }

            return Result.Success(emailModel);

        }

        public async Task AddAsync(EmailModel emailModel)
        {

            if (emailModel == null)
            {
                throw new ArgumentNullException("Somthing went wrong");
            }

            if (_validationService.ValidateEmail(emailModel.Email) == false)
            {
                throw new ArgumentNullException(nameof(emailModel.Email));
            }

            await _context.Email.AddAsync(emailModel);
            await _context.SaveChangesAsync();

        }

        public async Task ConfirmEmailAddressAsync(string email)
        {

            if (email is null)
            {
                throw new ArgumentNullException(nameof(email));
            }

            await _context.Email.ExecuteUpdateAsync(e => e.SetProperty(x => x.IsConfirmed, true));
            await _context.SaveChangesAsync();

        }

    }
}
