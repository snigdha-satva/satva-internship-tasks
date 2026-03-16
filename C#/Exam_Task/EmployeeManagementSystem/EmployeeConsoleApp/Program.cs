using EmployeeConsoleApp.Enums;
using EmployeeConsoleApp.Models;
using EmployeeConsoleApp.Services;
using EmployeeConsoleApp.Utilities;
using EmployeeConsoleApp.Validators;

namespace EmployeeConsoleApp
{
    internal sealed class Program
    {
        private static IEmployeeService _employeeService = null!;
        private static EmployeeValidator _validator = null!;

        private static readonly string[] AcceptedDateFormats = ["yyyy-MM-dd", "dd-MMM-yyyy", "dd-MM-yyyy", "MM/dd/yyyy"];

        private static void Main()
        {
            try
            {
                InitializeApplication();
                RunMainLoop();
            }
            catch (Exception ex)
            {
                ConsoleHelper.DisplayError($"Fatal error: {ex.Message}");
                Environment.Exit(1);
            }
        }

        private static void InitializeApplication()
        {
            var fileHelper = new FileHelper();
            _employeeService = new EmployeeService(fileHelper);
            _validator = new EmployeeValidator();

            ConsoleHelper.DisplayInfo($"Data file: {fileHelper.FilePath}");
        }

        private static void RunMainLoop()
        {
            bool isRunning = true;

            while (isRunning)
            {
                try
                {
                    ConsoleHelper.DisplayMenu();
                    string selectedOption = ConsoleHelper.ReadInput("Select an option: ");

                    switch (selectedOption)
                    {
                        case "1":
                            HandleAddEmployee();
                            break;
                        case "2":
                            HandleDeleteEmployee();
                            break;
                        case "3":
                            isRunning = false;
                            ConsoleHelper.DisplayInfo("Exiting the program. Goodbye!");
                            break;
                        default:
                            ConsoleHelper.DisplayError("Invalid option. Please select 1, 2, or 3.");
                            break;
                    }
                }
                catch (Exception ex)
                {
                    ConsoleHelper.DisplayError(ex.Message);
                }
            }
        }

        private static void HandleAddEmployee()
        {
            try
            {
                Console.WriteLine();
                ConsoleHelper.DisplayInfo("--- Add New Employee ---");

                while (true)
                {
                    var employee = CollectEmployeeDetails();
                    var (isValid, errors) = _validator.Validate(employee);

                    if (!isValid)
                    {
                        ConsoleHelper.DisplayError("Validation failed:");
                        errors.ForEach(error => ConsoleHelper.DisplayError($"  - {error}"));
                        ConsoleHelper.DisplayWarning("Please re-enter the employee details.");
                        Console.WriteLine();
                        continue;
                    }

                    bool isAdded = _employeeService.TryAddEmployee(employee, out string? errorMessage);

                    if (isAdded)
                    {
                        ConsoleHelper.DisplaySuccess($"Employee '{employee.Name}' (ID: {employee.EmployeeID}) added successfully.");
                        return;
                    }

                    ConsoleHelper.DisplayError(errorMessage ?? "Failed to add employee. Please try again.");
                    ConsoleHelper.DisplayWarning("Please try again.");
                    Console.WriteLine();
                }
            }
            catch (Exception ex)
            {
                ConsoleHelper.DisplayError($"An error occurred while adding employee: {ex.Message}");
            }
        }

        private static void HandleDeleteEmployee()
        {
            try
            {
                Console.WriteLine();
                string employeeId = ConsoleHelper.ReadRequiredString(
                    "Please provide the employee ID which you want to delete: ",
                    isValid: EmployeeValidator.IsValidEmployeeId,
                    invalidMessage: "Employee ID must be exactly 6 characters (letters A-F and digits 0-9)."
                );

                bool isDeleted = _employeeService.DeleteEmployee(employeeId);

                if (isDeleted)
                {
                    ConsoleHelper.DisplaySuccess($"Employee with ID '{employeeId}' deleted successfully.");
                }
                else
                {
                    ConsoleHelper.DisplayError($"Employee with ID '{employeeId}' not found. Please check the ID and try again.");
                }
            }
            catch (Exception ex)
            {
                ConsoleHelper.DisplayError($"An error occurred while deleting employee: {ex.Message}");
            }
        }

        private static Employee CollectEmployeeDetails()
        {
            var employee = new Employee();

            employee.EmployeeID = GenerateUniqueEmployeeId();
            ConsoleHelper.DisplayInfo($"Generated Employee ID: {employee.EmployeeID}");

            employee.Name = ConsoleHelper.ReadRequiredString(
                "Please enter Name: ",
                isValid: EmployeeValidator.IsValidName,
                invalidMessage: "Name must be 2-100 characters and contain only letters (spaces, apostrophes, and hyphens are allowed)."
            );

            employee.DOB = ConsoleHelper.ReadRequiredDate(
                $"Please enter Date of Birth ({AcceptedDateFormats[0]}): ",
                AcceptedDateFormats,
                isValid: EmployeeValidator.IsValidDob,
                invalidMessage: "Date of Birth must be in the past, realistic, and the employee must be at least 14 years old."
            );

            employee.Gender = ReadGender();

            employee.Designation = ConsoleHelper.ReadRequiredString(
                "Please enter Designation: ",
                isValid: EmployeeValidator.IsValidDesignation,
                invalidMessage: "Designation must be 2-100 characters."
            );

            employee.City = ConsoleHelper.ReadRequiredString(
                "Please enter City: ",
                isValid: EmployeeValidator.IsValidCityOrState,
                invalidMessage: "City must be 2-80 characters and contain only letters and common separators (space, dot, hyphen, apostrophe)."
            );

            employee.State = ConsoleHelper.ReadRequiredString(
                "Please enter State: ",
                isValid: EmployeeValidator.IsValidCityOrState,
                invalidMessage: "State must be 2-80 characters and contain only letters and common separators (space, dot, hyphen, apostrophe)."
            );

            employee.Postcode = ConsoleHelper.ReadRequiredString(
                "Please enter Postcode: ",
                isValid: EmployeeValidator.IsValidPostcode,
                invalidMessage: "Postcode must be 4-10 digits."
            );

            employee.Phone = ReadUniquePhone();
            employee.Email = ReadUniqueEmail();

            employee.DateOfJoining = ConsoleHelper.ReadRequiredDate(
                $"Please enter Date of Joining ({AcceptedDateFormats[0]}): ",
                AcceptedDateFormats,
                isValid: date => EmployeeValidator.IsValidDateOfJoining(date, employee.DOB),
                invalidMessage: "Date of Joining must be after DOB, not in the future, and not earlier than a realistic working age."
            );

            employee.Remarks = ConsoleHelper.ReadRequiredString(
                "Please enter Remarks: ",
                isValid: value => value.Trim().Length <= 500,
                invalidMessage: "Remarks must be 500 characters or less."
            );

            ConsoleHelper.DisplayInfo("Departments: 1=Sales, 2=Marketing, 3=Development, 4=QA, 5=HR, 6=SEO");
            employee.Department = ConsoleHelper.ReadRequiredEnum<Department>(
                "Please enter Department (name or number): ",
                "Invalid Department. Valid options: Sales, Marketing, Development, QA, HR, SEO (or 1-6)."
            );

            employee.MonthlySalary = ConsoleHelper.ReadRequiredDecimal(
                "Please enter Monthly Salary: ",
                isValid: value => value > 0 && value <= 1_000_000_000m,
                invalidMessage: "Monthly Salary must be greater than 0 and not unreasonably large."
            );

            return employee;
        }

        private static string GenerateUniqueEmployeeId()
        {
            for (int attempt = 0; attempt < 100; attempt++)
            {
                string employeeId = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();

                if (!_employeeService.EmployeeExists(employeeId))
                {
                    return employeeId;
                }
            }

            throw new InvalidOperationException("Unable to generate a unique Employee ID. Please try again.");
        }

	        private static string ReadGender()
	        {
	            while (true)
	            {
	                string input = ConsoleHelper.ReadRequiredString("Please enter Gender (M/F): ");

                string normalized = input.Trim().ToUpperInvariant();
                if (normalized is "M" or "MALE")
                {
                    return "M";
                }

                if (normalized is "F" or "FEMALE")
                {
                    return "F";
                }

	                ConsoleHelper.DisplayError("Gender must be 'M' for Male or 'F' for Female.");
	            }
	        }

	        private static string ReadUniquePhone()
	        {
	            while (true)
	            {
	                string raw = ConsoleHelper.ReadRequiredString(
	                    "Please enter Phone: ",
	                    isValid: value => EmployeeValidator.TryNormalizePhone(value, out _),
	                    invalidMessage: "Phone must contain 10-15 digits (you can include spaces, +, or hyphens)."
	                );

	                _ = EmployeeValidator.TryNormalizePhone(raw, out string normalized);

	                if (_employeeService.PhoneExists(normalized))
	                {
	                    ConsoleHelper.DisplayError("This phone number is already used by another employee. Please enter a different phone number.");
	                    continue;
                }

                return normalized;
            }
        }

	        private static string ReadUniqueEmail()
	        {
	            while (true)
	            {
	                string raw = ConsoleHelper.ReadRequiredString(
	                    "Please enter Email: ",
	                    isValid: value => EmployeeValidator.TryNormalizeEmail(value, out _),
	                    invalidMessage: "Email format is invalid."
	                );

	                _ = EmployeeValidator.TryNormalizeEmail(raw, out string trimmed);

	                if (_employeeService.EmailExists(trimmed))
	                {
	                    ConsoleHelper.DisplayError("This email is already used by another employee. Please enter a different email.");
	                    continue;
                }

                return trimmed;
            }
        }
    }
}
