using System;
using System.Collections.Generic;
using System.Linq;

namespace Practical2.Services
{
    public class ListTransformationService
    {
        public List<int> TransformList(List<int> numbers)
        {
            ArgumentNullException.ThrowIfNull(numbers);

            if (numbers.Count == 0)
            {
                return [];
            }

            return [.. numbers.Select(x => (x + 2) * 5)];
        }

        public void DisplayTransformation(List<int> numbers)
        {
            Console.WriteLine("Original List: " + string.Join(", ", numbers));
            
            List<int> transformed = TransformList(numbers);
            
            Console.WriteLine("Transformed List ((x + 2) * 5): " + string.Join(", ", transformed));
        }
    }
}