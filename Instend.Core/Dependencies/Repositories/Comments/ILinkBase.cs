
using CSharpFunctionalExtensions;
using Exider.Core.Models.Links;

namespace Exider.Core.Dependencies.Repositories.Comments
{
    public interface ILinkBase
    {
        public abstract static Result<T> Create<T>(Guid itemId, Guid linkedItemId) where T : LinkBase, new();
    }
}