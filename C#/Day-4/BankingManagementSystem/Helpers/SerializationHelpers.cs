using System;
using System.IO;
using System.Xml.Serialization;

namespace BankingManagementSystem.Helpers
{
    public static class SerializationHelper
    {
        public static void SerializeToXml<T>(T data, string filePath)
        {
            try
            {
                XmlSerializer serializer = new XmlSerializer(typeof(T));
                using StreamWriter writer = new StreamWriter(filePath);
                serializer.Serialize(writer, data);
            }
            catch (UnauthorizedAccessException ex)
            {
                throw new IOException($"Access denied while writing to file: {filePath}", ex);
            }
            catch (DirectoryNotFoundException ex)
            {
                throw new IOException($"Directory not found for file path: {filePath}", ex);
            }
            catch (Exception ex)
            {
                throw new IOException($"Unexpected error during XML serialization: {ex.Message}", ex);
            }
        }

        public static T DeserializeFromXml<T>(string filePath)
        {
            try
            {
                if (!File.Exists(filePath))
                    throw new FileNotFoundException($"Data file not found at path: {filePath}");

                XmlSerializer serializer = new XmlSerializer(typeof(T));
                using StreamReader reader = new StreamReader(filePath);
                return (T)serializer.Deserialize(reader);
            }
            catch (FileNotFoundException)
            {
                throw;
            }
            catch (InvalidOperationException ex)
            {
                throw new InvalidOperationException($"Failed to deserialize XML from file: {filePath}", ex);
            }
            catch (Exception ex)
            {
                throw new IOException($"Unexpected error during XML deserialization: {ex.Message}", ex);
            }
        }
    }
}