using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.CompilerServices;

enum Designation { Developer, QA };
enum EmployeeGenders { Female, Male, Others };
class Employee
{
    public int ID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    [JsonConverter(typeof(StringEnumConverter))]
    public EmployeeGenders Gender { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }

    public Designation Designation { get; set; }
    public decimal Salary { get; set; }

    private static string FilePath = "employeesData.json";

    private static List<Employee> LoadEmployeeData()
    {
        if (!File.Exists(FilePath))
        {
            return new List<Employee>();
        }

        string json = File.ReadAllText(FilePath);
        return JsonConvert.DeserializeObject<List<Employee>>(json);
    }

    private static void SaveEmployeeData(List<Employee> employeeList)
    {
        string json = JsonConvert.SerializeObject(employeeList, Formatting.Indented);
        File.WriteAllText(FilePath, json);
    }

    public static void AddEmployee()
    {
        var list = LoadEmployeeData();
        var employee = new Employee();

        Console.Write("First Name: ");
        string firstName = Console.ReadLine();

        if (!firstName.IsRequired())
        {
            Console.WriteLine("First Name is required.");
            return;
        }
        employee.FirstName = firstName;


        Console.Write("Last Name: ");
        string lastName = Console.ReadLine();

        if (!lastName.IsRequired())
        {
            Console.WriteLine("Last Name is required.");
            return;
        }
        employee.LastName = lastName;


        Console.Write("Gender (Female, Male, Others): ");
        string gender = Console.ReadLine();

        if (!gender.IsGender())
        {
            Console.WriteLine("Invalid Gender.");
            return;
        }
        employee.Gender = Enum.Parse<EmployeeGenders>(gender, true);

        Console.Write("Email: ");
        string email = Console.ReadLine();

        if (!email.IsRequired())
        {
            Console.WriteLine("Email is required."); 
            return;
        }

        if (!email.IsEmail())
        {
            Console.WriteLine("Email is not valid."); 
            return;
        }

        if (list.Any(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase)))
        {
            Console.WriteLine("Email already exists."); 
            return;
        }
        employee.Email = email;

        Console.Write("Phone (10 digits): ");
        string phone = Console.ReadLine();

        if (!phone.IsPhoneNumber())
        {
            Console.WriteLine("Phone must be 10 digits."); 
            return;
        }
        employee.Phone = phone;

        Console.Write("Designation (Developer / QA): ");
        string designation = Console.ReadLine();

        if (!designation.IsDesignation())
        {
            Console.WriteLine("Invalid Designation."); 
            return;
        }
        employee.Designation = Enum.Parse<Designation>(designation, true);

        Console.Write("Salary (10000 - 50000): ");
        string salaryInput = Console.ReadLine();

        if (!decimal.TryParse(salaryInput, out decimal salary) || !salary.IsSalary())
        {
            Console.WriteLine("Salary must be between 10,000 and 50,000."); 
            return;
        }
        employee.Salary = salary;


        employee.ID = list.Count > 0 ? list.Max(e => e.ID) + 1 : 1;
        list.Add(employee);
        SaveEmployeeData(list);
        Console.WriteLine($"Employee added with ID: {employee.ID}");
    }

    public static void Update()
    {
        var list = LoadEmployeeData();

        Console.Write("Enter ID to update: ");
        if (!int.TryParse(Console.ReadLine(), out int id)) { Console.WriteLine("Invalid ID."); return; }

        var emp = list.FirstOrDefault(e => e.ID == id);
        if (emp == null) 
        { 
            Console.WriteLine("Employee not found."); 
            return; 
        }

        Console.WriteLine("Press Enter to keep current value.\n");

        Console.Write($"First Name [{emp.FirstName}]: ");
        string firstName = Console.ReadLine();
        if (firstName.IsRequired()) emp.FirstName = firstName;

        Console.Write($"Last Name [{emp.LastName}]: ");
        string lastName = Console.ReadLine();
        if (lastName.IsRequired()) emp.LastName = lastName;

        Console.Write($"Gender [{emp.Gender}]: ");
        string gender = Console.ReadLine();
        if (gender.IsRequired())
        {
            if (!gender.IsGender()) { Console.WriteLine("Invalid Gender."); return; }
            emp.Gender = Enum.Parse<EmployeeGenders>(gender, true);
        }

        Console.Write($"Email [{emp.Email}]: ");
        string email = Console.ReadLine();
        if (email.IsRequired())
        {
            if (!email.IsEmail()) 
            { 
                Console.WriteLine("Invalid email."); 
                return; 
            }
            if (list.Any(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase) && e.ID != id))
            { Console.WriteLine("Email already exists."); return; }
            emp.Email = email;
        }

        Console.Write($"Phone [{emp.Phone}]: ");
        string phone = Console.ReadLine();
        if (phone.IsRequired())
        {
            if (!phone.IsPhoneNumber()) 
            { 
                Console.WriteLine("Phone must be 10 digits."); 
                return; 
            }
            emp.Phone = phone;
        }

        Console.Write($"Designation [{emp.Designation}] (Developer / QA): ");
        string designation = Console.ReadLine();
        if (designation.IsRequired())
        {
            if (!designation.IsDesignation()) 
            { 
                Console.WriteLine("Invalid Designation."); 
                return; 
            }
            emp.Designation = Enum.Parse<Designation>(designation, true);
        }

        Console.Write($"Salary [{emp.Salary}] (10000 - 50000): ");
        string salaryInput = Console.ReadLine();
        if (salaryInput.IsRequired())
        {
            if (!decimal.TryParse(salaryInput, out decimal salary) || !salary.IsSalary())
            { 
                Console.WriteLine("Salary must be between 10,000 and 50,000."); 
                return; 
            }
            emp.Salary = salary;
        }

        SaveEmployeeData(list);
        Console.WriteLine("Employee updated successfully.");
    }

    public static void Delete()
    {
        var list = LoadEmployeeData();

        Console.Write("Enter ID to delete: ");
        if (!int.TryParse(Console.ReadLine(), out int id))
        {
            Console.WriteLine("Invalid ID."); return;
        }

        var emp = list.FirstOrDefault(e => e.ID == id);
        if (emp == null)
        {
            Console.WriteLine("Employee not found."); return;
        }

        list.Remove(emp);
        SaveEmployeeData(list);
        Console.WriteLine("Employee deleted successfully.");
    }

    public static void ShowAll()
    {
        var list = LoadEmployeeData();
        if (list.Count == 0) { Console.WriteLine("No employees found."); return; }

        Console.WriteLine($"\n{"ID",-5} {"FirstName",-12} {"LastName",-12} {"Gender",-8} {"Email",-25} {"Phone",-12} {"Designation",-12} {"Salary"}");
        Console.WriteLine(new string('-', 100));

        foreach (var e in list)
            Console.WriteLine($"{e.ID,-5} {e.FirstName,-12} {e.LastName,-12} {e.Gender,-8} {e.Email,-25} {e.Phone,-12} {e.Designation,-12} {e.Salary:C}");
    }

    public static void ShowByID()
    {
        var list = LoadEmployeeData();

        Console.Write("Enter ID: ");
        if (!int.TryParse(Console.ReadLine(), out int id)) { Console.WriteLine("Invalid ID."); return; }

        var emp = list.FirstOrDefault(e => e.ID == id);
        if (emp == null) { Console.WriteLine("Employee not found."); return; }

        Display(emp);
    }

    public static void ShowByEmail()
    {
        var list = LoadEmployeeData();

        Console.Write("Enter Email: ");
        string email = Console.ReadLine();

        var emp = list.FirstOrDefault(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        if (emp == null) { Console.WriteLine("Employee not found."); return; }

        Display(emp);
    }
    static void Display(Employee e)
    {
        Console.WriteLine($"\n ID : {e.ID}");
        Console.WriteLine($" First Name : {e.FirstName}");
        Console.WriteLine($" Last Name : {e.LastName}");
        Console.WriteLine($" Gender : {e.Gender}");
        Console.WriteLine($" Email : {e.Email}");
        Console.WriteLine($" Phone : {e.Phone}");
        Console.WriteLine($" Designation : {e.Designation}");
        Console.WriteLine($" Salary : {e.Salary:C}");
    }
}


static class Validations
{
    public static bool IsRequired(this string value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    public static bool IsGender(this string gender)
    {
        return Enum.TryParse<EmployeeGenders>(gender, true, out _);
    }
    public static bool IsEmail(this string email)
    {
        return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
    }

    public static bool IsPhoneNumber(this string phone)
    {
        return phone.IsRequired() && Regex.IsMatch(phone, @"^\d{10}$");
    }

    public static bool IsDesignation(this string designation)
    {
        return Enum.TryParse<Designation>(designation, false, out _);
    }

    public static bool IsSalary(this decimal salary)
    {
        return salary >= 10000 && salary <= 50000;
    }
}

class EmployeeCRUD
{
    static void Main()
    {
        const string desiredPin = "1234";
        var map = new ExeConfigurationFileMap { ExeConfigFilename = Path.GetFullPath("App.Config") };
        Configuration config = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);
        var settings = config.AppSettings.Settings;
        if (settings["PIN"] == null) settings.Add("PIN", desiredPin);
        else settings["PIN"].Value = desiredPin;
        config.Save(ConfigurationSaveMode.Modified);
        var pin = desiredPin;


        Console.Write("Enter PIN: ");
        if (Console.ReadLine() != settings["PIN"]?.Value) { Console.WriteLine("Invalid PIN. Access Denied."); return; }
        Console.WriteLine("Access Granted!\n");
        
        while (true)
        {
            Console.WriteLine("\n1. Add Employee");
            Console.WriteLine("2. Update Employee");
            Console.WriteLine("3. Delete Employee");
            Console.WriteLine("4. Show All Employees");
            Console.WriteLine("5. Show Employee by ID");
            Console.WriteLine("6. Show Employee by Email");
            Console.WriteLine("7. Exit");
            Console.Write("\nSelect Option: ");

            switch (Console.ReadLine())
            {
                case "1": Employee.AddEmployee(); break;
                case "2": Employee.Update(); break;
                case "3": Employee.Delete(); break;
                case "4": Employee.ShowAll(); break;
                case "5": Employee.ShowByID(); break;
                case "6": Employee.ShowByEmail(); break;
                case "7": return;
                default: Console.WriteLine("Invalid option."); break;
            }
        }
    }

}
