using System.Text.RegularExpressions;

namespace EmployeeManagementSystem.Extensions
{
    public static class ValidationExtensions
    {
        public static bool IsValidEmail(this string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return Regex.IsMatch(email, @"^(?!.*\.\.)[a-zA-Z0-9](?:[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{0,62}[a-zA-Z0-9])?@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$");
        }

        public static bool IsValidPhoneNumber(this string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber)) return false;
            return Regex.IsMatch(phoneNumber, @"^\d{10}$");
        }
    }
}