
using CSharpFunctionalExtensions;
using Instend.Core.Models.Abstraction;

namespace Instend.Core.Dependencies.Repositories.Comments
{
    public interface ILinkBase
    {
        public abstract static Result<T> Create<T>(Guid itemId, Guid linkedItemId) where T : LinkBase, new();
    }
}