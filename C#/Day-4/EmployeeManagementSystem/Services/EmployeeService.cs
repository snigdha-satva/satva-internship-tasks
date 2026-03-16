using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using EmployeeManagementSystem.Extensions;
using EmployeeManagementSystem.Helpers;
using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Security;

namespace EmployeeManagementSystem.Services
{
	    public class EmployeeService
	    {
	        private readonly string _filePath;
	        private readonly string _aesKey;
	        private List<Employee> _employees;

	        public bool EmailExists(string email)
	        {
	            if (string.IsNullOrWhiteSpace(email))
	            {
	                return false;
	            }

	            return _employees.Any(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
	        }

	        public EmployeeService()
	        {
	            _filePath = ConfigurationManager.AppSettings["EmployeeFilePath"];
	            _aesKey = ConfigurationManager.AppSettings["AesKey"];
            _employees = LoadEmployees();
        }

        private List<Employee> LoadEmployees()
        {
            try
            {
                return SerializationHelper.DeserializeFromJson<List<Employee>>(_filePath) ?? new List<Employee>();
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine("No existing employee file found. Starting fresh.");
                return new List<Employee>();
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Corrupt employee data file: {ex.Message}");
                return new List<Employee>();
            }
            catch (IOException ex)
            {
                Console.WriteLine($"File read error: {ex.Message}");
                return new List<Employee>();
            }
        }

        public void AddEmployee(string firstName, string lastName, string email, string phoneNumber, decimal salary, string password)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(firstName))
                    throw new ArgumentNullException(nameof(firstName), "First name is required.");

                if (string.IsNullOrWhiteSpace(lastName))
                    throw new ArgumentNullException(nameof(lastName), "Last name is required.");

                if (!email.IsValidEmail())
                    throw new ArgumentException("Invalid email format.", nameof(email));

                if (!phoneNumber.IsValidPhoneNumber())
                    throw new ArgumentException("Phone number must be exactly 10 digits.", nameof(phoneNumber));

                if (salary < 20000 || salary > 100000)
                    throw new ArgumentOutOfRangeException(nameof(salary), "Salary must be between 20,000 and 1,00,000.");

                if (string.IsNullOrWhiteSpace(password))
                    throw new ArgumentNullException(nameof(password), "Password is required.");

                if (_employees.Any(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase)))
                    throw new InvalidOperationException($"An employee with email '{email}' already exists.");

                var employee = new Employee
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    PhoneNumber = phoneNumber,
                    Salary = salary,
                    Password = AesEncryption.Encrypt(password, _aesKey)
                };

                _employees.Add(employee);
                SerializationHelper.SerializeToJson(_employees, _filePath);

                Console.WriteLine($"\nEmployee '{firstName} {lastName}' added successfully with ID: {employee.Id}");
            }
            catch (ArgumentNullException ex)
            {
                Console.WriteLine($"\n[Validation Error] {ex.Message}");
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"\n[Validation Error] {ex.Message}");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"\n[Duplicate Error] {ex.Message}");
            }
            catch (IOException ex)
            {
                Console.WriteLine($"\n[File Error] Failed to save employee data: {ex.Message}");
            }
        }

        public void RetrieveAllEmployees()
        {
            try
            {
                if (_employees.Count == 0)
                {
                    Console.WriteLine("\nNo employees found.");
                    return;
                }

                Console.WriteLine("\n========== Employee Records ==========");
                foreach (var emp in _employees)
                {
                    string decryptedPassword = AesEncryption.Decrypt(emp.Password, _aesKey);
                    Console.WriteLine($"ID         : {emp.Id}");
                    Console.WriteLine($"Name       : {emp.FirstName} {emp.LastName}");
                    Console.WriteLine($"Email      : {emp.Email}");
                    Console.WriteLine($"Phone      : {emp.PhoneNumber}");
                    Console.WriteLine($"Salary     : {emp.Salary:C}");
                    Console.WriteLine($"Password   : {decryptedPassword}");
                    Console.WriteLine("--------------------------------------");
                }
            }
            catch (FormatException ex)
            {
                Console.WriteLine($"\n[Decryption Error] Could not decrypt password: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"\n[Error] Failed to retrieve employees: {ex.Message}");
            }
        }
    }
}
