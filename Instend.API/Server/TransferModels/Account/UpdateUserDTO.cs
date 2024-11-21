namespace Instend_Version_2._0._0.Server.TransferModels.Account
{
    public record UpdateUserDTO 
    (
        string? name,
        string? surname,
        string? nickname,
        string? avatar,
        string? header
    );
}