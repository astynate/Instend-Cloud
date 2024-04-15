using System.ComponentModel.DataAnnotations;

namespace Exider_Version_2._0._0.Server.TransferModels.Account
{
    public record UserAccessModel(
        [Required] Guid Id,
        [Required] int Ability
    );
}