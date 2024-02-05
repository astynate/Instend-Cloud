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

    }

}
