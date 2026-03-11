// Write a program in C# Sharp to append some text to an existing file. 
namespace System;

class WriteDataInFile
{
    static void Main()
    {
        string filePath = "myfile.txt";
        string fileInput = "This is the first line for this file — from Task-4.\n";

        File.AppendAllText(filePath, fileInput);

        Console.WriteLine("File created and data appended in it!");
    }
}