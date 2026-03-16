using System;
using EmployeeManagementSystem.Services;

namespace EmployeeManagementSystem
{
    class Program
    {
        static void Main()
        {
            EmployeeService service = new EmployeeService();
            bool running = true;

            Console.WriteLine("====================================");
            Console.WriteLine("   Secure Employee Management System");
            Console.WriteLine("====================================");

            while (running)
            {
                Console.WriteLine("\n1. Add New Employee");
                Console.WriteLine("2. Retrieve All Employees");
                Console.WriteLine("3. Exit");
                Console.Write("\nEnter your choice: ");

                string choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        HandleAddEmployee(service);
                        break;

                    case "2":
                        service.RetrieveAllEmployees();
                        break;

                    case "3":
                        running = false;
                        Console.WriteLine("\nGoodbye!");
                        break;

                    default:
                        Console.WriteLine("Invalid choice. Please enter 1, 2, or 3.");
                        break;
                }
            }
        }

        private static void HandleAddEmployee(EmployeeService service)
        {
            Console.WriteLine("\n--- Add New Employee ---");

            string firstName = GetValidName("First Name");
            string lastName = GetValidName("Last Name");
            string email = GetValidEmail();
            string phone = GetValidPhoneNumber();
            decimal salary = GetValidSalary();
            string password = GetValidPassword();

            service.AddEmployee(firstName, lastName, email, phone, salary, password);
        }

        private static string GetValidName(string fieldName)
        {
            while (true)
            {
                Console.Write($"{fieldName}: ");
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine($"{fieldName} cannot be empty. Please try again.");
                    continue;
                }

                if (input.Trim().Length < 2)
                {
                    Console.WriteLine($"{fieldName} must be at least 2 characters. Please try again.");
                    continue;
                }

                if (input.Trim().Length > 50)
                {
                    Console.WriteLine($"{fieldName} cannot exceed 50 characters. Please try again.");
                    continue;
                }

                bool isValid = true;
                foreach (char c in input.Trim())
                {
                    if (!char.IsLetter(c))
                    {
                        isValid = false;
                        break;
                    }
                }

                if (!isValid)
                {
                    Console.WriteLine($"{fieldName} can only contain letters. Please try again.");
                    continue;
                }

                return input.Trim();
            }
        }

        private static string GetValidEmail()
        {
            while (true)
            {
                Console.Write("Email: ");
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine("Email cannot be empty. Please try again.");
                    continue;
                }

                input = input.Trim();

                if (!input.Contains("@"))
                {
                    Console.WriteLine("Email must contain '@'. Please try again.");
                    continue;
                }

                string[] parts = input.Split('@');

                if (parts.Length != 2 || string.IsNullOrWhiteSpace(parts[0]) || string.IsNullOrWhiteSpace(parts[1]))
                {
                    Console.WriteLine("Invalid email format. Please try again.");
                    continue;
                }

                if (!parts[1].Contains("."))
                {
                    Console.WriteLine("Email domain must contain a dot (e.g., example.com). Please try again.");
                    continue;
                }

                return input;
            }
        }

        private static string GetValidPhoneNumber()
        {
            while (true)
            {
                Console.Write("Phone Number (10 digits): ");
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine("Phone number cannot be empty. Please try again.");
                    continue;
                }

                input = input.Trim();

                if (input.Length != 10)
                {
                    Console.WriteLine($"Phone number must be exactly 10 digits. You entered {input.Length} character(s). Please try again.");
                    continue;
                }

                bool allDigits = true;
                foreach (char c in input)
                {
                    if (!char.IsDigit(c))
                    {
                        allDigits = false;
                        break;
                    }
                }

                if (!allDigits)
                {
                    Console.WriteLine("Phone number must contain digits only. Please try again.");
                    continue;
                }

                return input;
            }
        }

        private static decimal GetValidSalary()
        {
            while (true)
            {
                Console.Write("Salary (20000 - 100000): ");
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine("Salary cannot be empty. Please try again.");
                    continue;
                }

                if (!decimal.TryParse(input.Trim(), out decimal salary))
                {
                    Console.WriteLine("Invalid salary. Please enter a valid number. Please try again.");
                    continue;
                }

                if (salary < 20000 || salary > 100000)
                {
                    Console.WriteLine($"Salary must be between 20,000 and 1,00,000. You entered {salary}. Please try again.");
                    continue;
                }

                return salary;
            }
        }

        private static string GetValidPassword()
        {
            while (true)
            {
                Console.Write("Password (min 6 characters): ");
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine("Password cannot be empty. Please try again.");
                    continue;
                }

                if (input.Trim().Length < 6)
                {
                    Console.WriteLine("Password must be at least 6 characters. Please try again.");
                    continue;
                }

                return input.Trim();
            }
        }
    }
}