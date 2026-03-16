using System;
using System.IO;
using System.Text.Json;

namespace EmployeeManagementSystem.Helpers
{
    public static class SerializationHelper
    {
        public static void SerializeToJson<T>(T data, string filePath)
        {
            try
            {
                string json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(filePath, json);
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
                throw new IOException($"Unexpected error during serialization: {ex.Message}", ex);
            }
        }

        public static T DeserializeFromJson<T>(string filePath)
        {
            try
            {
                if (!File.Exists(filePath))
                    return default;

                string json = File.ReadAllText(filePath);
                return JsonSerializer.Deserialize<T>(json);
            }
            catch (FileNotFoundException ex)
            {
                throw new FileNotFoundException($"File not found: {filePath}", ex);
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException($"Failed to deserialize JSON from file: {filePath}", ex);
            }
            catch (Exception ex)
            {
                throw new IOException($"Unexpected error during deserialization: {ex.Message}", ex);
            }
        }
    }
}