using System;

class MultipleChoice
{
    static void Main()
    {
        Console.Write("Enter your name: ");
        string userName = Console.ReadLine();

        Console.WriteLine("Greeting, " + userName + "! Welcome to this Quiz");

        string[] quizQuestions =
        {
            "What is the capital of France?",
            "Which planet is known as the Red Planet?",
            "What is 5 + 3?",
            "Which language runs in a web browser?",
            "Who wrote Hamlet?",
            "Which is the largest ocean?",
            "What is the square root of 64?",
            "Which gas do plants use for photosynthesis?",
            "Who is known as the father of computers?",
            "Which country invented pizza?"
        };

        char[] quizAnswers = { 'A','B','C','D','A','D','C','C','A','B' };

        string[, ] quizOptions =
        {
            {"A) Paris","B) London","C) Rome","D) Berlin"},
            {"A) Earth","B) Mars","C) Jupiter","D) Venus"},
            {"A) 6","B) 7","C) 8","D) 9"},
            {"A) Python","B) Java","C) C#","D) JavaScript"},
            {"A) Shakespeare","B) Dickens","C) Tolstoy","D) Homer"},
            {"A) Atlantic","B) Indian","C) Arctic","D) Pacific"},
            {"A) 6","B) 7","C) 8","D) 9"},
            {"A) Oxygen","B) Nitrogen","C) Carbon Dioxide","D) Hydrogen"},
            {"A) Charles Babbage","B) Newton","C) Einstein","D) Tesla"},
            {"A) France","B) Italy","C) USA","D) Spain"}
        };

        int quizScore = 0;

        for (int i = 0; i < quizQuestions.Length; i++)
        {
            Console.WriteLine(quizQuestions[i]);
            
            for(int j = 0; j < 4; j++)
            {
                Console.WriteLine(quizOptions[i,j]);
            }

            string userAnswer = Console.ReadLine().Trim().ToUpper();

            if (userAnswer.Length > 0 && userAnswer[0] == quizAnswers[i])
            {
                Console.WriteLine("Correct Answer!!");
                quizScore++;
            }
            else
            {
                Console.WriteLine("Incorrect Answer!!");
            }
        }

        double finalScorePercent = (double)(quizScore * 100) / quizQuestions.Length;
        Console.WriteLine(userName + "'s Score: " + finalScorePercent + " %");

        if (finalScorePercent >= 70)
        {
            Console.WriteLine("Pass!!");
        }
        else
        {
            Console.WriteLine("Fail!!");
        }

    }
}