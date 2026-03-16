using System;
using System.Collections.Generic;
using System.Linq;
using Practical2.Services;

namespace Practical2
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("===== LIST TRANSFORMATION =====\n");
            RunListTransformation();

            Console.WriteLine("\n===== PAGE NUMBER GROUPING =====\n");
            RunPageGrouping();
        }

        static List<int> GetNumbersFromUser(string prompt)
        {
            Console.Write(prompt);
            string input = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(input))
                return [];

            return [.. input
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => int.TryParse(s, out _))
                .Select(int.Parse)];
        }

        static void RunListTransformation()
        {
            ListTransformationService service = new ListTransformationService();

            List<int> numbers = GetNumbersFromUser("Enter numbers separated by commas (e.g., 1,2,3,4,5): ");

            if (numbers.Count == 0)
            {
                Console.WriteLine("No valid numbers entered.");
                return;
            }

            Console.WriteLine($"You entered: {string.Join(", ", numbers)}");
            service.DisplayTransformation(numbers);
        }

        static void RunPageGrouping()
        {
            PageGroupingService service = new PageGroupingService();

            List<int> pageNumbers = GetNumbersFromUser("Enter page numbers separated by commas (e.g., 1,2,4,6,7,8): ");

            if (pageNumbers.Count == 0)
            {
                Console.WriteLine("No valid page numbers entered.");
                return;
            }

            List<int> validPageNumbers = pageNumbers.Where(p => p > 0).Distinct().OrderBy(p => p).ToList();

            if (validPageNumbers.Count == 0)
            {
                Console.WriteLine("No valid positive page numbers entered.");
                return;
            }

            if (validPageNumbers.Count != pageNumbers.Count)
            {
                Console.WriteLine($"Note: Filtered to valid unique positive numbers: {string.Join(", ", validPageNumbers)}");
            }

            service.DisplayGrouping(validPageNumbers);
        }
    }
}