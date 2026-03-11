// Read data from file.
namespace System;

class ReadDataFromFile
{
    static void Main()
    {
        string filePath = "myfile2.txt";
        string fileInput = "This is the first line for this file — Task 2.\n";

        File.WriteAllText(filePath, fileInput);

        Console.WriteLine(File.ReadAllText("myfile2.txt"));
    }
}