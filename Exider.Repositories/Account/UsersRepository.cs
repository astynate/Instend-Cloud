using Exider.Core;
using Exider.Core.Dependencies.Repositories.Account;
using Exider.Core.Models.Account;

namespace Exider.Repositories.Repositories
{
    public class UsersRepository : IUsersRepository
    {

        private readonly DatabaseContext _context = null!;

        public UsersRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<UserModel> GetUserByPublicId(string id)
        {

            //uint privateId = EncryptionService
            //    .DecryptPublicIdToPrivate(id);

            //return await _context.Users
            //    .AsNoTracking()
            //    .FirstOrDefaultAsync(user => user.PublicId == id)
            //        ?? throw new ArgumentException("User id cannot be empty");

            return null;

        }

        public async Task AddAsync(UserModel user)
        {

            //if (user == null)
            //{
            //    throw new ArgumentNullException(nameof(user));
            //}

            //user.Password = EncryptionService
            //    .HashUsingSHA256(user.Password);

            //await _context.Users.AddAsync(user);
            //await _context.SaveChangesAsync();

        }

        public Task<UserModel> GetUserByEmail(string email)
        {
            throw new NotImplementedException();
        }
    }

}
