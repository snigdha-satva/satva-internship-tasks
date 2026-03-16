using System;

namespace Practical3.Models
{
    public class Student
    {
        public int RollNumber { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Course { get; set; } = string.Empty;
        public bool IsBestStudent { get; set; }

        public Student() { }

        public Student(int rollNumber, string name, string course)
        {
            if (rollNumber <= 0)
            {
                throw new ArgumentException("Roll number must be positive");
            }

            RollNumber = rollNumber;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Course = course ?? throw new ArgumentNullException(nameof(course));
            IsBestStudent = false;
        }

        public override string ToString()
        {
            string bestTag = IsBestStudent ? " [BEST STUDENT]" : "";
            return $"Roll No: {RollNumber}, Name: {Name}, Course: {Course}{bestTag}";
        }

        public override bool Equals(object? obj)
        {
            if (obj is Student other)
            {
                return RollNumber == other.RollNumber;
            }
            return false;
        }

        public override int GetHashCode()
        {
            return RollNumber.GetHashCode();
        }
    }
}
