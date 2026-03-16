using System.Text.Json.Serialization;
using EmployeeConsoleApp.Enums;
using EmployeeConsoleApp.Utilities;

namespace EmployeeConsoleApp.Models
{
    internal sealed class Employee
    {
        public string EmployeeID { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfJoining { get; set; }
        public int TotalExperience => DateOfJoining.CalculateYearsFromToday();
        public string TotalExperienceDisplay => DateOfJoining.CalculateExperienceFromToday();
        public string Remarks { get; set; } = string.Empty;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Department Department { get; set; }

        public string DepartmentColor => DepartmentColorMapper.GetHtmlColor(Department);
        public decimal MonthlySalary { get; set; }

        public string FormattedDOB => DOB.ToFormattedDateString();
        public string FormattedDateOfJoining => DateOfJoining.ToFormattedDateString();
    }
}
