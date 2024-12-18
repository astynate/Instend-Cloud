using Instend.Core.Models.Public;

namespace Instend.Core.TransferModels.Publication
{
    public record GroupedReactions
    (
        Guid reactionId,
        long count,
        PublicationReaction? reaction,
        PublicationReaction? TargetAccountReaction
    );
}