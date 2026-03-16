using System.Net.Mail;
using System.Text.RegularExpressions;
using EmployeeConsoleApp.Enums;
using EmployeeConsoleApp.Models;

namespace EmployeeConsoleApp.Validators
{
    internal sealed class EmployeeValidator
    {
        private static readonly Regex EmployeeIdRegex = new(@"^[A-F0-9]{6}$", RegexOptions.Compiled);
        private static readonly Regex NameRegex = new(@"^[A-Za-z]+([ '\-][A-Za-z]+)*$", RegexOptions.Compiled);
        private static readonly Regex DesignationRegex = new(@"^[A-Za-z0-9]+([A-Za-z0-9 .,'&()\/\-]*[A-Za-z0-9])?$", RegexOptions.Compiled);
        private static readonly Regex CityStateRegex = new(@"^[A-Za-z]+([ .'\-][A-Za-z]+)*$", RegexOptions.Compiled);
        private static readonly Regex PostcodeRegex = new(@"^\d{4,10}$", RegexOptions.Compiled);
        private static readonly Regex DigitsOnlyRegex = new(@"\D+", RegexOptions.Compiled);

        private readonly List<string> _errors = new();

        internal (bool IsValid, List<string> Errors) Validate(Employee employee)
        {
            _errors.Clear();

            ValidateEmployeeID(employee.EmployeeID);
            ValidateName(employee.Name);
            ValidateDOB(employee.DOB);
            ValidateGender(employee.Gender);
            ValidateDesignation(employee.Designation);
            ValidateCity(employee.City);
            ValidateState(employee.State);
            ValidatePostcode(employee.Postcode);
            ValidatePhone(employee.Phone);
            ValidateEmail(employee.Email);
            ValidateDateOfJoining(employee.DateOfJoining, employee.DOB);
            ValidateRemarks(employee.Remarks);
            ValidateDepartment(employee.Department);
            ValidateSalary(employee.MonthlySalary);

            return (_errors.Count == 0, new List<string>(_errors));
        }

        internal static bool IsValidEmployeeId(string employeeId)
        {
            if (string.IsNullOrWhiteSpace(employeeId))
            {
                return false;
            }

            employeeId = employeeId.Trim().ToUpperInvariant();
            return EmployeeIdRegex.IsMatch(employeeId);
        }

        internal static bool IsValidName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return false;
            }

            name = name.Trim();
            return name.Length is >= 2 and <= 100 && NameRegex.IsMatch(name);
        }

        internal static bool IsValidDesignation(string designation)
        {
            if (string.IsNullOrWhiteSpace(designation))
            {
                return false;
            }

            designation = designation.Trim();
            return designation.Length is >= 2 and <= 100 && DesignationRegex.IsMatch(designation);
        }

        internal static bool IsValidCityOrState(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return false;
            }

            value = value.Trim();
            return value.Length is >= 2 and <= 80 && CityStateRegex.IsMatch(value);
        }

        internal static bool IsValidPostcode(string postcode)
        {
            if (string.IsNullOrWhiteSpace(postcode))
            {
                return false;
            }

            postcode = postcode.Trim();
            return PostcodeRegex.IsMatch(postcode);
        }

        internal static bool TryNormalizePhone(string rawPhone, out string normalizedDigits)
        {
            normalizedDigits = NormalizePhoneDigits(rawPhone);
            return normalizedDigits.Length is >= 10 and <= 15;
        }

        internal static bool TryNormalizeEmail(string rawEmail, out string normalizedEmail)
        {
            normalizedEmail = (rawEmail ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(normalizedEmail) || normalizedEmail.Length > 254)
            {
                normalizedEmail = string.Empty;
                return false;
            }

            try
            {
                _ = new MailAddress(normalizedEmail);
                return true;
            }
            catch
            {
                normalizedEmail = string.Empty;
                return false;
            }
        }

        internal static bool IsValidDob(DateTime dob)
        {
            dob = dob.Date;

            if (dob == default || dob >= DateTime.Today)
            {
                return false;
            }

            if (dob < DateTime.Today.AddYears(-100))
            {
                return false;
            }

            int age = CalculateAge(dob, DateTime.Today);
            return age >= 14;
        }

        internal static bool IsValidDateOfJoining(DateTime dateOfJoining, DateTime dob)
        {
            dateOfJoining = dateOfJoining.Date;
            dob = dob.Date;

            if (dateOfJoining == default || dateOfJoining > DateTime.Today)
            {
                return false;
            }

            if (dob != default && dateOfJoining <= dob)
            {
                return false;
            }

            if (dob != default && dateOfJoining < dob.AddYears(14))
            {
                return false;
            }

            return true;
        }

        private void ValidateEmployeeID(string employeeId)
        {
            if (string.IsNullOrWhiteSpace(employeeId))
            {
                _errors.Add("Employee ID is required.");
                return;
            }

            employeeId = employeeId.Trim().ToUpperInvariant();

            if (!EmployeeIdRegex.IsMatch(employeeId))
            {
                _errors.Add("Employee ID must be exactly 6 characters (letters A-F and digits 0-9).");
            }
        }

        private void ValidateName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                _errors.Add("Name is required.");
                return;
            }

            name = name.Trim();

            if (name.Length is < 2 or > 100)
            {
                _errors.Add("Name must be between 2 and 100 characters.");
                return;
            }

            if (!NameRegex.IsMatch(name))
            {
                _errors.Add("Name contains invalid characters.");
            }
        }

        private void ValidateDOB(DateTime dob)
        {
            if (dob == default)
            {
                _errors.Add("Date of Birth is required.");
                return;
            }

            dob = dob.Date;

            if (dob >= DateTime.Today)
            {
                _errors.Add("Date of Birth must be before today.");
                return;
            }

            if (dob < DateTime.Today.AddYears(-100))
            {
                _errors.Add("Date of Birth is not realistic.");
                return;
            }

            int age = CalculateAge(dob, DateTime.Today);
            if (age < 14)
            {
                _errors.Add("Employee must be at least 14 years old.");
            }
        }

        private void ValidateGender(string gender)
        {
            if (string.IsNullOrWhiteSpace(gender))
            {
                _errors.Add("Gender is required.");
                return;
            }

            gender = gender.Trim().ToUpperInvariant();

            if (gender != "M" && gender != "F")
            {
                _errors.Add("Gender must be 'M' for Male or 'F' for Female.");
            }
        }

        private void ValidateDesignation(string designation)
        {
            if (string.IsNullOrWhiteSpace(designation))
            {
                _errors.Add("Designation is required.");
                return;
            }

            designation = designation.Trim();

            if (designation.Length is < 2 or > 100)
            {
                _errors.Add("Designation must be between 2 and 100 characters.");
                return;
            }

            if (!DesignationRegex.IsMatch(designation))
            {
                _errors.Add("Designation contains invalid characters.");
            }
        }

        private void ValidateCity(string city)
        {
            if (string.IsNullOrWhiteSpace(city))
            {
                _errors.Add("City is required.");
                return;
            }

            city = city.Trim();

            if (city.Length is < 2 or > 80)
            {
                _errors.Add("City must be between 2 and 80 characters.");
                return;
            }

            if (!CityStateRegex.IsMatch(city))
            {
                _errors.Add("City contains invalid characters.");
            }
        }

        private void ValidateState(string state)
        {
            if (string.IsNullOrWhiteSpace(state))
            {
                _errors.Add("State is required.");
                return;
            }

            state = state.Trim();

            if (state.Length is < 2 or > 80)
            {
                _errors.Add("State must be between 2 and 80 characters.");
                return;
            }

            if (!CityStateRegex.IsMatch(state))
            {
                _errors.Add("State contains invalid characters.");
            }
        }

        private void ValidatePostcode(string postcode)
        {
            if (string.IsNullOrWhiteSpace(postcode))
            {
                _errors.Add("Postcode is required.");
                return;
            }

            postcode = postcode.Trim();

            if (!PostcodeRegex.IsMatch(postcode))
            {
                _errors.Add("Postcode must be 4-10 digits.");
            }
        }

        private void ValidatePhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
            {
                _errors.Add("Phone is required.");
                return;
            }

            string digitsOnly = NormalizePhoneDigits(phone);

            if (digitsOnly.Length is < 10 or > 15)
            {
                _errors.Add("Phone must be 10-15 digits.");
            }
        }

        private void ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                _errors.Add("Email is required.");
                return;
            }

            email = email.Trim();

            if (email.Length > 254)
            {
                _errors.Add("Email is too long.");
                return;
            }

            try
            {
                _ = new MailAddress(email);
            }
            catch
            {
                _errors.Add("Email format is invalid.");
            }
        }

        private void ValidateDateOfJoining(DateTime dateOfJoining, DateTime dob)
        {
            if (dateOfJoining == default)
            {
                _errors.Add("Date of Joining is required.");
                return;
            }

            dateOfJoining = dateOfJoining.Date;
            dob = dob.Date;

            if (dateOfJoining > DateTime.Today)
            {
                _errors.Add("Date of Joining cannot be in the future.");
                return;
            }

            if (dateOfJoining <= dob)
            {
                _errors.Add("Date of Joining must be after Date of Birth.");
                return;
            }

            if (dob != default && dateOfJoining < dob.AddYears(14))
            {
                _errors.Add("Date of Joining is too early based on Date of Birth.");
            }
        }

        private void ValidateRemarks(string remarks)
        {
            if (string.IsNullOrWhiteSpace(remarks))
            {
                _errors.Add("Remarks is required.");
                return;
            }

            remarks = remarks.Trim();

            if (remarks.Length > 500)
            {
                _errors.Add("Remarks must be 500 characters or less.");
            }
        }

        private void ValidateDepartment(Department department)
        {
            if (!Enum.IsDefined(typeof(Department), department))
            {
                _errors.Add("Department is required.");
            }
        }

        private void ValidateSalary(decimal salary)
        {
            if (salary <= 0)
            {
                _errors.Add("Monthly Salary must be greater than 0.");
                return;
            }

            if (salary > 1_000_000_000m)
            {
                _errors.Add("Monthly Salary is too large.");
            }
        }

        private static int CalculateAge(DateTime dob, DateTime today)
        {
            int age = today.Year - dob.Year;
            if (dob.Date > today.AddYears(-age))
            {
                age--;
            }

            return age;
        }

        private static string NormalizePhoneDigits(string? phone)
        {
            phone = (phone ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(phone))
            {
                return string.Empty;
            }

            return DigitsOnlyRegex.Replace(phone, string.Empty);
        }
    }
}
