// Write an array of strings to the file.
namespace System;

class ReadArrayOfStrings
{
    static void Main()
    {
        string[] inputStrings =
        {
          "This is string 1",
          "This is string 2",
          "This is string 3",
          "This is string 4"
        };

        File.WriteAllLines("myFile3.txt", inputStrings);

        Console.WriteLine("All lines input successfully");
    }
}