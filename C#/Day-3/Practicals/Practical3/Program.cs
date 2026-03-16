using System;
using System.Collections.Generic;
using System.Linq;
using Practical3.Models;
using Practical3.Services;

namespace Practical3
{
    class Program
    {
        static CollegeAdmissionService college = new CollegeAdmissionService();
        static readonly List<string> validDepartments =
        [
            "Computer Science",
            "Electronics",
            "Mechanical",
            "Civil",
            "Electrical",
            "Chemical"
        ];

        static void Main(string[] args)
        {
            bool continueProgram = true;

            while (continueProgram)
            {
                Console.WriteLine("\n===== COLLEGE ADMISSION SYSTEM =====");
                Console.WriteLine("1. Admit New Student");
                Console.WriteLine("2. Remove Student");
                Console.WriteLine("3. Mark as Best Student");
                Console.WriteLine("4. View All Students");
                Console.WriteLine("5. View Best Students");
                Console.WriteLine("6. Exit");
                Console.Write("Select an option: ");

                string choice = Console.ReadLine()?.Trim();

                switch (choice)
                {
                    case "1":
                        RunAdmitStudent();
                        break;
                    case "2":
                        RunRemoveStudent();
                        break;
                    case "3":
                        RunMarkBestStudent();
                        break;
                    case "4":
                        RunViewAllStudents();
                        break;
                    case "5":
                        RunViewBestStudents();
                        break;
                    case "6":
                        continueProgram = false;
                        Console.WriteLine("Thank you for using College Admission System. Goodbye!");
                        break;
                    default:
                        Console.WriteLine("Invalid option. Please enter a number between 1 and 6.");
                        break;
                }
            }
        }

        static void RunAdmitStudent()
        {
            Console.WriteLine("\n===== ADMIT NEW STUDENT =====");
            Console.WriteLine("(Type 'back' at any prompt to return to main menu)\n");

            while (true)
            {
                int? rollNumber = GetRollNumberFromUser("Enter Roll Number: ");
                if (rollNumber == null) return;

                string name = GetNameFromUser("Enter Student Name: ");
                if (name == null) return;

                string department = GetDepartmentFromUser();
                if (department == null) return;

                Student newStudent = new Student(rollNumber.Value, name, department);
                college.AdmitStudent(newStudent);

                if (!AskToContinue("Admit another student?"))
                    return;

                Console.WriteLine();
            }
        }

        static void RunRemoveStudent()
        {
            Console.WriteLine("\n===== REMOVE STUDENT =====");
            Console.WriteLine("(Type 'back' to return to main menu)\n");

            if (!HasStudents())
            {
                Console.WriteLine("No students enrolled in the system.");
                return;
            }

            while (true)
            {
                college.PrintAllStudents();
                Console.WriteLine();

                int? rollNumber = GetRollNumberFromUser("Enter Roll Number to remove: ");
                if (rollNumber == null) return;

                college.RemoveStudent(rollNumber.Value);

                if (!HasStudents())
                {
                    Console.WriteLine("\nNo more students in the system.");
                    return;
                }

                if (!AskToContinue("Remove another student?"))
                    return;

                Console.WriteLine();
            }
        }

        static void RunMarkBestStudent()
        {
            Console.WriteLine("\n===== MARK AS BEST STUDENT =====");
            Console.WriteLine("(Type 'back' to return to main menu)\n");

            if (!HasStudents())
            {
                Console.WriteLine("No students enrolled in the system.");
                return;
            }

            while (true)
            {
                college.PrintAllStudents();
                Console.WriteLine();

                int? rollNumber = GetRollNumberFromUser("Enter Roll Number to mark as best: ");
                if (rollNumber == null) return;

                college.MarkAsBestStudent(rollNumber.Value);

                if (!AskToContinue("Mark another student as best?"))
                    return;

                Console.WriteLine();
            }
        }

        static void RunViewAllStudents()
        {
            Console.WriteLine("\n===== ALL STUDENTS =====\n");

            if (!HasStudents())
            {
                Console.WriteLine("No students enrolled in the system.");
                return;
            }

            college.PrintAllStudents();

            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }

        static void RunViewBestStudents()
        {
            Console.WriteLine("\n===== BEST STUDENTS =====\n");

            college.PrintBestStudents();

            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }

        static void SearchByRollNumber()
        {
            int? rollNumber = GetRollNumberFromUser("Enter Roll Number to search: ");
            if (rollNumber == null) return;

            Console.WriteLine("\nSearch not implemented - add your search logic here.");
        }

        static void SearchByName()
        {
            Console.Write("Enter name to search: ");
            string name = Console.ReadLine()?.Trim();

            if (string.IsNullOrWhiteSpace(name) || name.ToLower() == "back")
                return;

            Console.WriteLine("\nSearch not implemented - add your search logic here.");
        }

        static void SearchByDepartment()
        {
            string department = GetDepartmentFromUser();
            if (department == null) return;

            Console.WriteLine("\nSearch not implemented - add your search logic here.");
        }

        static int? GetRollNumberFromUser(string prompt)
        {
            while (true)
            {
                Console.Write(prompt);
                string input = Console.ReadLine()?.Trim();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine("Error: Roll number cannot be empty. Please try again.\n");
                    continue;
                }

                if (input.ToLower() == "back")
                    return null;

                if (!int.TryParse(input, out int rollNumber))
                {
                    Console.WriteLine("Error: Roll number must be a valid integer. Please try again.\n");
                    continue;
                }

                if (rollNumber <= 0)
                {
                    Console.WriteLine("Error: Roll number must be a positive number. Please try again.\n");
                    continue;
                }

                return rollNumber;
            }
        }

        static string GetNameFromUser(string prompt)
        {
            while (true)
            {
                Console.Write(prompt);
                string input = Console.ReadLine()?.Trim();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine("Error: Name cannot be empty. Please try again.\n");
                    continue;
                }

                if (input.ToLower() == "back")
                    return null;

                if (input.Length < 2)
                {
                    Console.WriteLine("Error: Name must be at least 2 characters. Please try again.\n");
                    continue;
                }

                if (input.Length > 100)
                {
                    Console.WriteLine("Error: Name cannot exceed 100 characters. Please try again.\n");
                    continue;
                }

                if (input.Any(char.IsDigit))
                {
                    Console.WriteLine("Error: Name cannot contain numbers. Please try again.\n");
                    continue;
                }

                if (!input.All(c => char.IsLetter(c) || char.IsWhiteSpace(c) || c == '-' || c == '\''))
                {
                    Console.WriteLine("Error: Name can only contain letters, spaces, hyphens, and apostrophes. Please try again.\n");
                    continue;
                }

                string formattedName = FormatName(input);
                return formattedName;
            }
        }

        static string FormatName(string name)
        {
            return string.Join(" ", name.Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Select(word => char.ToUpper(word[0]) + word.Substring(1).ToLower()));
        }

        static string GetDepartmentFromUser()
        {
            while (true)
            {
                Console.WriteLine("\nAvailable Departments:");
                for (int i = 0; i < validDepartments.Count; i++)
                {
                    Console.WriteLine($"  {i + 1}. {validDepartments[i]}");
                }
                Console.Write("Select department (number or name): ");

                string input = Console.ReadLine()?.Trim();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine("Error: Department selection cannot be empty. Please try again.");
                    continue;
                }

                if (input.ToLower() == "back")
                    return null;

                if (int.TryParse(input, out int deptNumber))
                {
                    if (deptNumber >= 1 && deptNumber <= validDepartments.Count)
                    {
                        return validDepartments[deptNumber - 1];
                    }
                    Console.WriteLine($"Error: Please enter a number between 1 and {validDepartments.Count}.");
                    continue;
                }

                string matchedDept = validDepartments
                    .FirstOrDefault(d => d.Equals(input, StringComparison.OrdinalIgnoreCase));

                if (matchedDept != null)
                {
                    return matchedDept;
                }

                matchedDept = validDepartments
                    .FirstOrDefault(d => d.StartsWith(input, StringComparison.OrdinalIgnoreCase));

                if (matchedDept != null)
                {
                    Console.WriteLine($"Matched to: {matchedDept}");
                    return matchedDept;
                }

                Console.WriteLine("Error: Invalid department. Please select from the list.");
            }
        }

        static bool HasStudents()
        {
            return true;
        }

        static bool AskToContinue(string message)
        {
            while (true)
            {
                Console.Write($"\n{message} (y/n): ");
                string response = Console.ReadLine()?.Trim().ToLower();

                if (response == "y" || response == "yes")
                    return true;

                if (response == "n" || response == "no")
                    return false;

                Console.WriteLine("Please enter 'y' or 'n'.");
            }
        }
    }
}