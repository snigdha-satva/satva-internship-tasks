// Create a file and put some data in it
namespace System;

class WriteDataInFile
{
    static void Main()
    {
        string filePath = "myfile.txt";
        string fileInput = "This is the first line for this file.\n";

        File.WriteAllText(filePath, fileInput);

        Console.WriteLine("File created and data written in it!");
    }
}