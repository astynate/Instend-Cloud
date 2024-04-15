using Exider.Core;
using System.ComponentModel.DataAnnotations;

namespace Exider_Version_2._0._0.Server.TransferModels.Account
{
    public class UserAccessModel
    {
        [Required] public string? Id { get; set; }
        [Required] public Configuration.Abilities Ability { get; set; }
    }
}