using CSharpFunctionalExtensions;

namespace Instend.Repositories.Messenger
{
    public interface IMessengerRepository
    {
        Task<bool> DeleteMessage(Guid id, Guid userId);
        Task<bool> ViewMessage(Guid messageId, Guid userId);
    }
}