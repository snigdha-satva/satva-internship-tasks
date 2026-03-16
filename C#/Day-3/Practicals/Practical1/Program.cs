using System;
using Practical1.Models;
using Practical1.Services;

namespace Practical1
{
    class Program
    {
        static void Main(string[] args)
        {
            string outputDirectory = "Output";

            Console.WriteLine("===== JSON SERIALIZATION =====\n");
            RunJsonSerialization(outputDirectory);

            Console.WriteLine("\n===== XML SERIALIZATION =====\n");
            RunXmlSerialization(outputDirectory);
        }

        static void RunJsonSerialization(string outputDirectory)
        {
            try
            {
                JsonSerializationService jsonService = new JsonSerializationService(outputDirectory);

                City city = new City("New York", 8419000);
                Person person = new Person("John Doe", 30, city);

                jsonService.SerializeToJson(person, "person.json");

                Person deserializedPerson = jsonService.DeserializeFromJson("person.json");

                Console.WriteLine("\nDeserialized Person from JSON:");
                Console.WriteLine(deserializedPerson);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        static void RunXmlSerialization(string outputDirectory)
        {
            try
            {
                XmlSerializationService xmlService = new XmlSerializationService(outputDirectory);

                City city = new City("Los Angeles", 3980000);
                Person person = new Person("Jane Smith", 25, city);

                xmlService.SerializeToXml(person, "person.xml");

                Person deserializedPerson = xmlService.DeserializeFromXml("person.xml");

                Console.WriteLine("\nDeserialized Person from XML:");
                Console.WriteLine(deserializedPerson);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
    }
}