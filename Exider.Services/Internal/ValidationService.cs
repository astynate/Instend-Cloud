using System.Text.RegularExpressions;

namespace Exider_Version_2._0._0.ServerApp.Services
{
    public static class ValidationService
    {

        private static string _emailRegularExpression = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$";

        public static bool ValidateVarchar(string field, int maxLength)
        {

            if (string.IsNullOrEmpty(field))
                return false;

            if (string.IsNullOrWhiteSpace(field))
                return false;

            if (field.Length > maxLength)
                return false;

            return true;

        }

        public static bool ValidateEmail(string field)
        {

            ValidateVarchar(field, 45);

            if (Regex.IsMatch(field, _emailRegularExpression) == false)
            {
                return false;
            }

            return true;

        }

    }

}
