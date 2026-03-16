using System;

namespace Practical1.Models
{
    public class City
    {
        public string Name { get; set; } = string.Empty;
        public long Population { get; set; }

        public City()
        {
        }

        public City(string name, long population)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Population = population >= 0 ? population : throw new ArgumentException("Population cannot be negative");
        }

        public override string ToString()
        {
            return $"City: {Name}, Population: {Population}";
        }
    }
}
