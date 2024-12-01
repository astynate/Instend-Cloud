using CSharpFunctionalExtensions;

namespace Instend.Core.Dependencies.Repositories.Messenger
{
    public interface IChatBase
    {
        Task<Result<object>> SendMessage(Guid ownerId, Guid userId, string text);
    }
}