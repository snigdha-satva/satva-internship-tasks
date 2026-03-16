using System;

namespace Practical1.Models
{
    public class Person
    {
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public City City { get; set; } = new City();

        public Person()
        {
        }

        public Person(string name, int age, City city)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Age = age >= 0 ? age : throw new ArgumentException("Age cannot be negative");
            City = city ?? throw new ArgumentNullException(nameof(city));
        }

        public override string ToString()
        {
            return $"Name: {Name}, Age: {Age}, {City}";
        }
    }
}
