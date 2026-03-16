using System;
using System.IO;
using System.Xml.Serialization;
using Practical1.Models;

namespace Practical1.Services
{
    public class XmlSerializationService
    {
        private readonly string _outputDirectory;

        public XmlSerializationService(string outputDirectory)
        {
            _outputDirectory = outputDirectory ?? throw new ArgumentNullException(nameof(outputDirectory));
            
            if (!Directory.Exists(_outputDirectory))
            {
                Directory.CreateDirectory(_outputDirectory);
            }
        }

        public void SerializeToXml(Person person, string fileName)
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
            XmlSerializer serializer = new XmlSerializer(typeof(Person));

            using (StreamWriter writer = new StreamWriter(filePath))
            {
                serializer.Serialize(writer, person);
            }

            Console.WriteLine($"XML file created at: {Path.GetFullPath(filePath)}");
        }

        public Person DeserializeFromXml(string fileName)
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

            XmlSerializer serializer = new XmlSerializer(typeof(Person));

            using (StreamReader reader = new StreamReader(filePath))
            {
                var deserialized = serializer.Deserialize(reader);
                return deserialized as Person
                    ?? throw new InvalidDataException("Failed to deserialize Person from XML.");
            }
        }
    }
}
