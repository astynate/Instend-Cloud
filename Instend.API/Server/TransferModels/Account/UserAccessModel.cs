using Instend.Core;
using System.ComponentModel.DataAnnotations;

namespace Instend_Version_2._0._0.Server.TransferModels.Account
{
    public class UserAccessModel
    {
        [Required] public string? Id { get; set; }
        [Required] public Configuration.EntityRoles Ability { get; set; }
    }
}