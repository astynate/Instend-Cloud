using System.Text.RegularExpressions;

namespace Exider_Version_2._0._0.ServerApp.Services
{
    public class ValidationService : IValidationService
    {

        private string _emailRegularExpression = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$";

        public bool ValidateVarchar(string field, int maxLength)
        {

            if (string.IsNullOrEmpty(field))
                return false;

            if (string.IsNullOrWhiteSpace(field))
                return false;

            if (field.Length > maxLength)
                return false;

            return true;

        }

        public bool ValidateEmail(string field)
        {

            if (ValidateVarchar(field, 45) == false)
            {
                return false;
            }

            if (Regex.IsMatch(field, _emailRegularExpression) == false)
            {
                return false;
            }

            return true;

        }

        public bool ValidatePassword(string field, int minValue, int maxValue)
        {

            if (ValidateVarchar(field, maxValue) == false)
            {
                return false;
            }

            if (field.Length < minValue)
            {
                return false;
            }

            return true;

        }

        public bool ValidateVarchar(params string[] args)
        {

            if (args.Length == 0) 
                return false;

            foreach (string argument in args)
            {
                if (ValidateVarchar(argument, 45) == false)
                {
                    return false;
                }
            }

            return true;

        }
    }

}
