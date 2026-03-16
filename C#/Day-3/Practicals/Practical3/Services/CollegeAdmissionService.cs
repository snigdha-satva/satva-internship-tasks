using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Practical3.Models;

namespace Practical3.Services
{
    public class CollegeAdmissionService
    {
        private List<Student> _students = new List<Student>();
        private readonly string _dataFilePath;

        public CollegeAdmissionService()
            : this(Path.Combine(FindProjectRoot("Practical3.csproj"), "Data"))
        {
        }

        public CollegeAdmissionService(string dataDirectory)
        {
            if (string.IsNullOrWhiteSpace(dataDirectory))
            {
                throw new ArgumentException("Data directory cannot be empty");
            }

            if (!Directory.Exists(dataDirectory))
            {
                Directory.CreateDirectory(dataDirectory);
            }

            _dataFilePath = Path.Combine(dataDirectory, "students.json");
            LoadStudents();
        }

        public int TotalStudents => _students.Count;

        private static string FindProjectRoot(string csprojFileName)
        {
            var dir = new DirectoryInfo(AppContext.BaseDirectory);
            while (dir is not null)
            {
                if (File.Exists(Path.Combine(dir.FullName, csprojFileName)))
                {
                    return dir.FullName;
                }
                dir = dir.Parent;
            }

            return Directory.GetCurrentDirectory();
        }

        private void LoadStudents()
        {
            if (!File.Exists(_dataFilePath))
            {
                _students = new List<Student>();
                return;
            }

            try
            {
                string json = File.ReadAllText(_dataFilePath);

                if (string.IsNullOrWhiteSpace(json))
                {
                    _students = new List<Student>();
                    return;
                }

                var loadedStudents = JsonSerializer.Deserialize<List<Student>>(json);

                if (loadedStudents == null)
                {
                    _students = new List<Student>();
                    return;
                }

                _students = loadedStudents
                    .Where(s => s != null && s.RollNumber > 0 && !string.IsNullOrWhiteSpace(s.Name))
                    .GroupBy(s => s.RollNumber)
                    .Select(g => g.First())
                    .ToList();

                SaveStudents();
            }
            catch (JsonException)
            {
                _students = new List<Student>();
                SaveStudents();
            }
        }

        private void SaveStudents()
        {
            var json = JsonSerializer.Serialize(_students, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_dataFilePath, json);
        }

        public bool AdmitStudent(Student student)
        {
            if (student == null)
            {
                Console.WriteLine("Error: Cannot admit null student.");
                return false;
            }

            if (student.RollNumber <= 0)
            {
                Console.WriteLine("Error: Roll number must be positive.");
                return false;
            }

            if (string.IsNullOrWhiteSpace(student.Name))
            {
                Console.WriteLine("Error: Student name cannot be empty.");
                return false;
            }

            if (_students.Any(s => s.RollNumber == student.RollNumber))
            {
                Console.WriteLine($"Error: Student with Roll No {student.RollNumber} already exists.");
                return false;
            }

            _students.Add(student);
            SaveStudents();

            Console.WriteLine($"Admission Successful: {student.Name} has been admitted.");
            Console.WriteLine($"Total number of students: {TotalStudents}");
            return true;
        }

        public bool AdmitMultipleStudents(IEnumerable<Student> students)
        {
            if (students == null)
            {
                Console.WriteLine("Error: Student list is null.");
                return false;
            }

            bool allSuccess = true;
            foreach (Student student in students)
            {
                if (!AdmitStudent(student))
                {
                    allSuccess = false;
                }
            }
            return allSuccess;
        }

        public bool RemoveStudent(int rollNumber)
        {
            if (rollNumber <= 0)
            {
                Console.WriteLine("Error: Invalid roll number.");
                return false;
            }

            Student studentToRemove = _students.FirstOrDefault(s => s.RollNumber == rollNumber);

            if (studentToRemove == null)
            {
                Console.WriteLine($"Error: Student with Roll No {rollNumber} not found.");
                return false;
            }

            _students.Remove(studentToRemove);
            SaveStudents();

            Console.WriteLine($"{studentToRemove.Name} has left the college.");
            Console.WriteLine($"Total number of students: {TotalStudents}");
            return true;
        }

        public bool RemoveMultipleStudents(IEnumerable<int> rollNumbers)
        {
            if (rollNumbers == null)
            {
                Console.WriteLine("Error: Roll number list is null.");
                return false;
            }

            bool allSuccess = true;
            foreach (int rollNumber in rollNumbers)
            {
                if (!RemoveStudent(rollNumber))
                {
                    allSuccess = false;
                }
            }
            return allSuccess;
        }

        public bool MarkAsBestStudent(int rollNumber)
        {
            if (rollNumber <= 0)
            {
                Console.WriteLine("Error: Invalid roll number.");
                return false;
            }

            Student student = _students.FirstOrDefault(s => s.RollNumber == rollNumber);

            if (student == null)
            {
                Console.WriteLine($"Error: Student with Roll No {rollNumber} not found.");
                return false;
            }

            if (student.IsBestStudent)
            {
                Console.WriteLine($"{student.Name} is already marked as Best Student.");
                return false;
            }

            student.IsBestStudent = true;
            SaveStudents();

            Console.WriteLine($"{student.Name} has been awarded as Best Student.");
            return true;
        }

        public bool RemoveBestStudentStatus(int rollNumber)
        {
            if (rollNumber <= 0)
            {
                Console.WriteLine("Error: Invalid roll number.");
                return false;
            }

            Student student = _students.FirstOrDefault(s => s.RollNumber == rollNumber);

            if (student == null)
            {
                Console.WriteLine($"Error: Student with Roll No {rollNumber} not found.");
                return false;
            }

            if (!student.IsBestStudent)
            {
                Console.WriteLine($"{student.Name} is not a Best Student.");
                return false;
            }

            student.IsBestStudent = false;
            SaveStudents();

            Console.WriteLine($"Best Student status removed from {student.Name}.");
            return true;
        }

        public void PrintBestStudents()
        {
            List<Student> bestStudents = _students.Where(s => s.IsBestStudent).ToList();

            if (bestStudents.Count == 0)
            {
                Console.WriteLine("No best students awarded yet.");
                return;
            }

            Console.WriteLine("\n========== BEST STUDENTS ==========");
            foreach (Student student in bestStudents)
            {
                Console.WriteLine(student);
            }
            Console.WriteLine($"Total Best Students: {bestStudents.Count}");
        }

        public void PrintAllStudents()
        {
            if (_students.Count == 0)
            {
                Console.WriteLine("No students enrolled in the college.");
                return;
            }

            Console.WriteLine("\n========== ALL STUDENTS ==========");
            foreach (Student student in _students.OrderBy(s => s.RollNumber))
            {
                Console.WriteLine(student);
            }
            Console.WriteLine($"Total Students: {TotalStudents}");
        }

        public Student GetStudent(int rollNumber)
        {
            return _students.FirstOrDefault(s => s.RollNumber == rollNumber);
        }

        public bool StudentExists(int rollNumber)
        {
            return _students.Any(s => s.RollNumber == rollNumber);
        }

        public void ClearAllStudents()
        {
            _students.Clear();
            SaveStudents();
            Console.WriteLine("All students have been removed from the college.");
        }
    }
}
