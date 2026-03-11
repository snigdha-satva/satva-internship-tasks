// Write a program in C# Sharp to read the first line from a file.
namespace System;

class ReadFirstLine
{
    static void Main()
    {
        Console.WriteLine(File.ReadLines("myfile.txt").First());
    }
}