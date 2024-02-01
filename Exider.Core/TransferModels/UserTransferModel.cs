using System.ComponentModel.DataAnnotations;

namespace Exider_Version_2._0._0.ServerApp.TransferObjects
{
    public record UserTransferModel(

         [Required][MaxLength(45)] string name,
         [Required][MaxLength(45)] string surname,
         [Required][MaxLength(45)] string nickname,
         [Required][MaxLength(45)] string email,
         [Required][MaxLength(45)] string password

    );

}
