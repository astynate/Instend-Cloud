namespace Exider_Version_2._0._0.ServerApp.Services
{
    public interface IValidationService
    {
        bool ValidateEmail(string field);
        bool ValidateVarchar(string field, int maxLength);
        bool ValidateVarchar(params string[] args);
        bool ValidatePassword(string field, int minValue, int maxValue);
    }
}