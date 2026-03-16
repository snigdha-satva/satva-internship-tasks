using System;
using System.Collections.Generic;
using System.Linq;

namespace Practical2.Services
{
    public class PageGroupingService
    {
        public string GroupPageNumbers(List<int> pageNumbers)
        {
            ArgumentNullException.ThrowIfNull(pageNumbers);

            if (pageNumbers.Count == 0)
            {
                return string.Empty;
            }

            List<int> sortedPages = [.. pageNumbers
                .Where(x => x > 0)
                .Distinct()
                .OrderBy(x => x)];

            if (sortedPages.Count == 0)
            {
                return string.Empty;
            }

            List<string> groups = [];
            int rangeStart = sortedPages[0];
            int rangeEnd = sortedPages[0];

            for (int i = 1; i < sortedPages.Count; i++)
            {
                if (sortedPages[i] == rangeEnd + 1)
                {
                    rangeEnd = sortedPages[i];
                }
                else
                {
                    groups.Add(FormatRange(rangeStart, rangeEnd));
                    rangeStart = sortedPages[i];
                    rangeEnd = sortedPages[i];
                }
            }

            groups.Add(FormatRange(rangeStart, rangeEnd));

            return string.Join(", ", groups);
        }

        private string FormatRange(int start, int end)
        {
            return start == end ? start.ToString() : $"{start}-{end}";
        }

        public void DisplayGrouping(List<int> pageNumbers)
        {
            Console.WriteLine("Original: " + string.Join(", ", pageNumbers));
            Console.WriteLine("Grouped: " + GroupPageNumbers(pageNumbers));
        }
    }
}