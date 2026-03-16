using System.Globalization;
using System.Text;

namespace EmployeeConsoleApp.Utilities
{
    internal static class ConsoleHelper
    {
        internal static void DisplayMenu()
        {
            var menuBuilder = new StringBuilder();
            menuBuilder.AppendLine();
            menuBuilder.AppendLine("+------------------------------------+");
            menuBuilder.AppendLine("|     Employee Management System     |");
            menuBuilder.AppendLine("+------------------------------------+");
            menuBuilder.AppendLine("|  1. Add New Employee               |");
            menuBuilder.AppendLine("|  2. Delete Employee                |");
            menuBuilder.AppendLine("|  3. Exit                           |");
            menuBuilder.AppendLine("+------------------------------------+");
            Console.Write(menuBuilder.ToString());
        }

        internal static void DisplaySuccess(string message)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(message);
            Console.ResetColor();
        }

        internal static void DisplayError(string message)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Error: {message}");
            Console.ResetColor();
        }

        internal static void DisplayInfo(string message)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine(message);
            Console.ResetColor();
        }

        internal static void DisplayWarning(string message)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(message);
            Console.ResetColor();
        }

        internal static string ReadInput(string prompt)
        {
            Console.Write(prompt);
            return Console.ReadLine()?.Trim() ?? string.Empty;
        }

        internal static string ReadRequiredString(string prompt, Func<string, bool>? isValid = null, string? invalidMessage = null)
        {
            while (true)
            {
                string value = ReadInput(prompt);

                if (string.IsNullOrWhiteSpace(value))
                {
                    DisplayError("This field is required. Please enter a value.");
                    continue;
                }

                value = value.Trim();

                if (isValid is not null && !isValid(value))
                {
                    DisplayError(string.IsNullOrWhiteSpace(invalidMessage) ? "Invalid input. Please try again." : invalidMessage);
                    continue;
                }

                return value;
            }
        }

        internal static DateTime ReadRequiredDate(string prompt, string[] acceptedFormats, Func<DateTime, bool>? isValid = null, string? invalidMessage = null)
        {
            while (true)
            {
                string raw = ReadInput(prompt);

                if (string.IsNullOrWhiteSpace(raw))
                {
                    DisplayError("This field is required. Please enter a date.");
                    continue;
                }

                raw = raw.Trim();

                bool parsed = DateTime.TryParseExact(
                    raw,
                    acceptedFormats,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AllowWhiteSpaces,
                    out DateTime date
                );

                if (!parsed)
                {
                    DisplayError($"Invalid date format. Accepted formats: {string.Join(", ", acceptedFormats)}");
                    continue;
                }

                date = date.Date;

                if (isValid is not null && !isValid(date))
                {
                    DisplayError(string.IsNullOrWhiteSpace(invalidMessage) ? "Invalid date. Please try again." : invalidMessage);
                    continue;
                }

                return date;
            }
        }

        internal static decimal ReadRequiredDecimal(string prompt, Func<decimal, bool>? isValid = null, string? invalidMessage = null)
        {
            while (true)
            {
                string raw = ReadInput(prompt);

                if (string.IsNullOrWhiteSpace(raw))
                {
                    DisplayError("This field is required. Please enter a number.");
                    continue;
                }

                raw = raw.Trim();

                if (!decimal.TryParse(raw, NumberStyles.Number, CultureInfo.InvariantCulture, out decimal value))
                {
                    DisplayError("Invalid number format. Please enter a valid number.");
                    continue;
                }

                if (isValid is not null && !isValid(value))
                {
                    DisplayError(string.IsNullOrWhiteSpace(invalidMessage) ? "Invalid number. Please try again." : invalidMessage);
                    continue;
                }

                return value;
            }
        }

        internal static TEnum ReadRequiredEnum<TEnum>(string prompt, string invalidMessage) where TEnum : struct, Enum
        {
            while (true)
            {
                string raw = ReadRequiredString(prompt);

                if (int.TryParse(raw, out int numericValue) && Enum.IsDefined(typeof(TEnum), numericValue))
                {
                    return (TEnum)Enum.ToObject(typeof(TEnum), numericValue);
                }

                if (Enum.TryParse<TEnum>(raw, true, out var parsed) && Enum.IsDefined(typeof(TEnum), parsed))
                {
                    return parsed;
                }

                DisplayError(invalidMessage);
            }
        }
    }
}
