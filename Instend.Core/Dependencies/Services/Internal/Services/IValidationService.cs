namespace Instend.Core.Dependencies.Services.Internal.Services
{
    public interface IValidationService
    {
        bool ValidateEmail(string field);
        bool ValidateVarchar(string field, int maxLength);
        bool ValidateVarchar(params string[] args);
        bool ValidatePassword(string field, int minValue, int maxValue);
    }
}