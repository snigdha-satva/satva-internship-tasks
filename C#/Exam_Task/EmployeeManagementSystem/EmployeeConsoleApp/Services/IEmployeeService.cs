using EmployeeConsoleApp.Models;

namespace EmployeeConsoleApp.Services
{
    internal interface IEmployeeService
    {
        bool EmailExists(string email);
        bool PhoneExists(string phone);
        bool TryAddEmployee(Employee employee, out string? errorMessage);
        bool DeleteEmployee(string employeeId);
        List<Employee> GetAllEmployees();
        bool EmployeeExists(string employeeId);
    }
}
