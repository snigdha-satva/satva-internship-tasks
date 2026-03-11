// Write a program in C# Sharp to count the number of lines in a file.
using System;
using System.IO;

class CountNumberOfLines
{
    static void Main()
    {
        Console.WriteLine(File.ReadLines("myfile.txt").Count());
    }
}