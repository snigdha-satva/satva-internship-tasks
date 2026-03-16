using System.Text.RegularExpressions;
using EmployeeConsoleApp.Models;
using EmployeeConsoleApp.Utilities;

namespace EmployeeConsoleApp.Services
{
    internal sealed class EmployeeService : IEmployeeService
    {
        private readonly FileHelper _fileHelper;
        private List<Employee>? _cache;
        private static readonly Regex NonDigitsRegex = new(@"\D+", RegexOptions.Compiled);

        internal EmployeeService(FileHelper fileHelper)
        {
            _fileHelper = fileHelper ?? throw new ArgumentNullException(nameof(fileHelper));
        }

        public List<Employee> GetAllEmployees()
        {
            _cache ??= _fileHelper.ReadEmployees();
            return _cache;
        }

        public bool EmployeeExists(string employeeId)
        {
            var employees = GetAllEmployees();
            return employees.Any(e => e.EmployeeID.Equals(employeeId, StringComparison.OrdinalIgnoreCase));
        }

        public bool EmailExists(string email)
        {
            string normalized = NormalizeEmail(email);
            if (string.IsNullOrWhiteSpace(normalized))
            {
                return false;
            }

            var employees = GetAllEmployees();
            return employees.Any(e => NormalizeEmail(e.Email) == normalized);
        }

        public bool PhoneExists(string phone)
        {
            string normalized = NormalizePhone(phone);
            if (string.IsNullOrWhiteSpace(normalized))
            {
                return false;
            }

            var employees = GetAllEmployees();
            return employees.Any(e => NormalizePhone(e.Phone) == normalized);
        }

        public bool TryAddEmployee(Employee employee, out string? errorMessage)
        {
            errorMessage = null;
            var employees = GetAllEmployees();

            if (employee is null)
            {
                errorMessage = "Employee details are missing.";
                return false;
            }

            string incomingEmployeeId = (employee.EmployeeID ?? string.Empty).Trim();
            string incomingEmail = NormalizeEmail(employee.Email);
            string incomingPhone = NormalizePhone(employee.Phone);

            bool duplicateId = employees.Any(e =>
                string.Equals((e.EmployeeID ?? string.Empty).Trim(), incomingEmployeeId, StringComparison.OrdinalIgnoreCase));

            if (duplicateId)
            {
                errorMessage = $"An employee with ID '{incomingEmployeeId}' already exists.";
                return false;
            }

            if (!string.IsNullOrWhiteSpace(incomingEmail))
            {
                bool duplicateEmail = employees.Any(e => NormalizeEmail(e.Email) == incomingEmail);
                if (duplicateEmail)
                {
                    errorMessage = $"An employee with Email '{employee.Email?.Trim()}' already exists. Duplicate entries are not allowed.";
                    return false;
                }
            }

            if (!string.IsNullOrWhiteSpace(incomingPhone))
            {
                bool duplicatePhone = employees.Any(e => NormalizePhone(e.Phone) == incomingPhone);
                if (duplicatePhone)
                {
                    errorMessage = $"An employee with Phone '{employee.Phone?.Trim()}' already exists. Duplicate entries are not allowed.";
                    return false;
                }
            }

            bool duplicateComposite = employees.Any(e =>
                NormalizeEmail(e.Email) == incomingEmail && NormalizePhone(e.Phone) == incomingPhone);

            if (duplicateComposite)
            {
                errorMessage = "An employee with the same Email and Phone already exists. Duplicate entries are not allowed.";
                return false;
            }

            employees.Add(employee);
            SaveAndRefreshCache(employees);
            return true;
        }

        public bool DeleteEmployee(string employeeId)
        {
            var employees = GetAllEmployees();

            var employeeToDelete = employees.FirstOrDefault(e =>
                e.EmployeeID.Equals(employeeId, StringComparison.OrdinalIgnoreCase));

            if (employeeToDelete is null)
            {
                return false;
            }

            employees.Remove(employeeToDelete);
            SaveAndRefreshCache(employees);
            return true;
        }

        private void SaveAndRefreshCache(List<Employee> employees)
        {
            _fileHelper.WriteEmployees(employees);
            _cache = _fileHelper.ReadEmployees();
        }

        private static string NormalizeEmail(string? email)
        {
            email = (email ?? string.Empty).Trim();
            return string.IsNullOrWhiteSpace(email) ? string.Empty : email.ToLowerInvariant();
        }

        private static string NormalizePhone(string? phone)
        {
            phone = (phone ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(phone))
            {
                return string.Empty;
            }

            return NonDigitsRegex.Replace(phone, string.Empty);
        }
    }
}
