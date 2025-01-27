using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;

namespace Instend.Core.Dependencies.Repositories.Messenger
{
    public interface IChatBase
    {
        Task<Result<DatabaseModel>> SendMessage(Guid id, Guid senderId, string text);
    }
}