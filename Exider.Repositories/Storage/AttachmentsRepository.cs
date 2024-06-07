using CSharpFunctionalExtensions;
using Exider.Core;
using Exider.Core.Dependencies.Repositories.Storage;
using Exider.Core.Models.Storage;

namespace Exider.Repositories.Storage
{
    public class AttachmentsRepository : IAttachmentsRepository
    {
        private readonly DatabaseContext _context = null!;

        public AttachmentsRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Result<AttachmentModel>> AddAsync(string name, string path, string? type, ulong size, Guid userId)
        {
            var result = AttachmentModel.Create(name, path, type, size, userId);

            if (result.IsFailure)
            {
                return result;
            }

            await _context.AddAsync(result.Value);
            await _context.SaveChangesAsync();

            return result.Value;
        }
    }
}
