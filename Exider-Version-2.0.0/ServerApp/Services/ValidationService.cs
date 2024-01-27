using System.Text.RegularExpressions;

namespace Exider_Version_2._0._0.ServerApp.Services
{
    public static class ValidationService
    {

        private static string _emailRegularExpression = @"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$";

        public static string ValidateVarchar(string field, int maxLength)
        {

            if (string.IsNullOrEmpty(field))
                throw new ArgumentNullException();

            if (string.IsNullOrWhiteSpace(field))
                throw new ArgumentNullException();

            if (field.Length > maxLength)
                throw new ArgumentException();

            return field;

        }

        public static string ValidateEmail(string field)
        {

            ValidateVarchar(field, 45);

            if (Regex.IsMatch(field, _emailRegularExpression) == false)
            {
                throw new ArgumentException();
            }

            return field;

        }

    }

}
