using System;
using System.IO;
using System.Text.Json;
using Practical1.Models;

namespace Practical1.Services
{
    public class JsonSerializationService
    {
        private readonly string _outputDirectory;

        public JsonSerializationService(string outputDirectory)
        {
            _outputDirectory = outputDirectory ?? throw new ArgumentNullException(nameof(outputDirectory));
            
            if (!Directory.Exists(_outputDirectory))
            {
                Directory.CreateDirectory(_outputDirectory);
            }
        }

        public void SerializeToJson(Person person, string fileName)
        {
            if (person == null)
            {
                throw new ArgumentNullException(nameof(person));
            }

            if (string.IsNullOrWhiteSpace(fileName))
            {
                throw new ArgumentException("File name cannot be empty");
            }

            string filePath = Path.Combine(_outputDirectory, fileName);
            var jsonString = JsonSerializer.Serialize(
                person,
                new JsonSerializerOptions { WriteIndented = true }
            );
            File.WriteAllText(filePath, jsonString);

            Console.WriteLine($"JSON file created at: {Path.GetFullPath(filePath)}");
        }

        public Person DeserializeFromJson(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
            {
                throw new ArgumentException("File name cannot be empty");
            }

            string filePath = Path.Combine(_outputDirectory, fileName);

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"File not found: {filePath}");
            }

            string jsonString = File.ReadAllText(filePath);
            var person = JsonSerializer.Deserialize<Person>(jsonString);
            return person ?? throw new InvalidDataException("Failed to deserialize Person from JSON.");
        }
    }
}
