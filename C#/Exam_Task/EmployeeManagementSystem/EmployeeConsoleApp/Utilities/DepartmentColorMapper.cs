using EmployeeConsoleApp.Enums;

namespace EmployeeConsoleApp.Utilities
{
    internal static class DepartmentColorMapper
    {
        private static readonly Dictionary<Department, ConsoleColor> ColorMap = new()
        {
            { Department.Sales, ConsoleColor.Red },
            { Department.Marketing, ConsoleColor.Green },
            { Department.Development, ConsoleColor.White },
            { Department.QA, ConsoleColor.Blue },
            { Department.HR, ConsoleColor.DarkYellow },
            { Department.SEO, ConsoleColor.Magenta }
        };

        private static readonly Dictionary<Department, string> HtmlColorMap = new()
        {
            { Department.Sales, "Red" },
            { Department.Marketing, "Green" },
            { Department.Development, "Black" },
            { Department.QA, "Blue" },
            { Department.HR, "Orange" },
            { Department.SEO, "Pink" }
        };

        internal static ConsoleColor GetConsoleColor(Department department)
        {
            return ColorMap.TryGetValue(department, out var color) ? color : ConsoleColor.Gray;
        }

        internal static string GetHtmlColor(Department department)
        {
            return HtmlColorMap.TryGetValue(department, out var color) ? color : "Gray";
        }
    }
}