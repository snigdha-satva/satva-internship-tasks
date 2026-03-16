using System.Text.Json;
using System.Xml.Linq;
using EmployeeConsoleApp.Models;

namespace EmployeeConsoleApp.Utilities
{
    internal sealed class FileHelper
    {
        private static readonly JsonSerializerOptions SerializerOptions = new()
        {
            WriteIndented = true,
            PropertyNameCaseInsensitive = true
        };

        private readonly string _filePath;

        internal FileHelper()
        {
            try
            {
                string basePath = ReadAppSetting("DataFilePath")
                    ?? throw new InvalidOperationException("DataFilePath is not configured in App.config.");

                basePath = Environment.ExpandEnvironmentVariables(basePath).Trim();

                if (string.IsNullOrWhiteSpace(basePath))
                {
                    throw new InvalidOperationException("DataFilePath is empty in App.config.");
                }

                basePath = Path.GetFullPath(basePath);
                Directory.CreateDirectory(basePath);

                string fileName = $"EmployeeData_{DateTime.Today:yyyyMMdd}.json";
                _filePath = Path.Combine(basePath, fileName);
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Unable to initialize employee data storage: {ex.Message}");
            }
        }

        internal string FilePath => _filePath;

        private static string? ReadAppSetting(string key)
        {
            try
            {
                string configPath = Path.Combine(AppContext.BaseDirectory, "App.config");

                if (!File.Exists(configPath))
                {
                    return null;
                }

                XDocument doc = XDocument.Load(configPath);

                string? value = doc
                    .Descendants("appSettings")
                    .Elements("add")
                    .Where(e => string.Equals((string?)e.Attribute("key"), key, StringComparison.OrdinalIgnoreCase))
                    .Select(e => (string?)e.Attribute("value"))
                    .FirstOrDefault();

                return string.IsNullOrWhiteSpace(value) ? null : value;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Unable to read App.config: {ex.Message}");
            }
        }

        internal List<Employee> ReadEmployees()
        {
            try
            {
                if (!File.Exists(_filePath))
                {
                    return new List<Employee>();
                }

                string jsonContent = File.ReadAllText(_filePath);

                if (string.IsNullOrWhiteSpace(jsonContent))
                {
                    return new List<Employee>();
                }

                return JsonSerializer.Deserialize<List<Employee>>(jsonContent, SerializerOptions)
                    ?? new List<Employee>();
            }
            catch (JsonException)
            {
                throw new InvalidOperationException("The employee data file is corrupted. Please check the JSON format.");
            }
            catch (UnauthorizedAccessException)
            {
                throw new InvalidOperationException("Access denied. Please check file permissions.");
            }
            catch (IOException ex)
            {
                throw new InvalidOperationException($"Unable to read employee data file: {ex.Message}");
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Unexpected error while reading employee data: {ex.Message}");
            }
        }

        internal void WriteEmployees(List<Employee> employees)
        {
            try
            {
                var sortedEmployees = employees
                    .OrderByDescending(e => e.MonthlySalary)
                    .ToList();

                string jsonContent = JsonSerializer.Serialize(sortedEmployees, SerializerOptions);
                File.WriteAllText(_filePath, jsonContent);
            }
            catch (UnauthorizedAccessException)
            {
                throw new InvalidOperationException("Access denied. Please check file permissions.");
            }
            catch (IOException ex)
            {
                throw new InvalidOperationException($"Unable to write employee data file: {ex.Message}");
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Unexpected error while writing employee data: {ex.Message}");
            }
        }
    }
}
