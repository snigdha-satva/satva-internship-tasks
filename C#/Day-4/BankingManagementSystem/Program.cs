using System;
using AutoMapper;
using BankingManagementSystem.Mappings;
using BankingManagementSystem.Models;
using BankingManagementSystem.Repositories;
using BankingManagementSystem.Services;
using Microsoft.Extensions.Logging.Abstractions;

namespace BankingManagementSystem
{
    class Program
    {
        static void Main()
        {
            MapperConfiguration mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<BankProfile>(), NullLoggerFactory.Instance);
            IMapper mapper = mapperConfig.CreateMapper();

            IAccountRepository repository = new AccountRepository();
            BankService bankService = new BankService(repository, mapper);

            bool running = true;

            Console.WriteLine("====================================");
            Console.WriteLine("     Configurable Banking System    ");
            Console.WriteLine("====================================");

            while (running)
            {
                Console.WriteLine("\n1. Open New Account");
                Console.WriteLine("2. Deposit Money");
                Console.WriteLine("3. Withdraw Money");
                Console.WriteLine("4. View Account Details & Transaction History");
                Console.WriteLine("5. View All Accounts");
                Console.WriteLine("6. Apply Monthly Interest");
                Console.WriteLine("7. Exit");
                Console.Write("\nEnter your choice: ");

                string choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        string holderName = GetValidName("Holder Name");
                        decimal initialDeposit = GetValidDeposit();
                        bankService.OpenAccount(holderName, initialDeposit);
                        break;

                    case "2":
                        string depositAccNo = GetValidAccountNumber();
                        decimal depositAmount = GetValidAmount("Deposit Amount");
                        bankService.PerformTransaction<DepositTransaction>(depositAccNo, depositAmount);
                        break;

                    case "3":
                        string withdrawAccNo = GetValidAccountNumber();
                        decimal withdrawAmount = GetValidAmount("Withdrawal Amount");
                        bankService.PerformTransaction<WithdrawTransaction>(withdrawAccNo, withdrawAmount);
                        break;

                    case "4":
                        string viewAccNo = GetValidAccountNumber();
                        bankService.DisplayAccountDetails(viewAccNo);
                        break;

                    case "5":
                        bankService.DisplayAllAccounts();
                        break;

                    case "6":
                        string interestAccNo = GetValidAccountNumber();
                        bankService.ApplyMonthlyInterest(interestAccNo);
                        break;

                    case "7":
                        running = false;
                        Console.WriteLine("\nThank you for using our Banking System. Goodbye!");
                        break;

                    default:
                        Console.WriteLine("Invalid choice. Please enter a number between 1 and 7.");
                        break;
                }
            }
        }

        private static string GetValidName(string fieldName)
        {
            while (true)
            {
                Console.Write($"{fieldName}: ");
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine($"{fieldName} cannot be empty. Please try again.");
                    continue;
                }

                input = input.Trim();

                if (input.Length < 2)
                {
                    Console.WriteLine($"{fieldName} must be at least 2 characters. Please try again.");
                    continue;
                }

                if (input.Length > 50)
                {
                    Console.WriteLine($"{fieldName} cannot exceed 50 characters. Please try again.");
                    continue;
                }

                bool isValid = true;
                foreach (char c in input)
                {
                    if (!char.IsLetter(c) && c != ' ')
                    {
                        isValid = false;
                        break;
                    }
                }

                if (!isValid)
                {
                    Console.WriteLine($"{fieldName} can only contain letters. Please try again.");
                    continue;
                }

                return input;
            }
        }

        private static string GetValidAccountNumber()
        {
            while (true)
            {
                Console.Write("Account Number: ");
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine("Account number cannot be empty. Please try again.");
                    continue;
                }

                input = input.Trim();

                if (input.Length != 8)
                {
                    Console.WriteLine("Account number must be exactly 8 characters. Please try again.");
                    continue;
                }

                return input.ToUpper();
            }
        }

        private static decimal GetValidDeposit()
        {
            while (true)
            {
                Console.Write("Initial Deposit (min 1000): ");
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine("Initial deposit cannot be empty. Please try again.");
                    continue;
                }

                if (!decimal.TryParse(input.Trim(), out decimal amount))
                {
                    Console.WriteLine("Invalid amount. Please enter a valid number. Please try again.");
                    continue;
                }

                if (amount <= 0)
                {
                    Console.WriteLine("Amount must be greater than zero. Please try again.");
                    continue;
                }

                if (amount < 1000)
                {
                    Console.WriteLine($"Initial deposit must be at least 1,000. You entered {amount}. Please try again.");
                    continue;
                }

                return amount;
            }
        }

        private static decimal GetValidAmount(string fieldName)
        {
            while (true)
            {
                Console.Write($"{fieldName}: ");
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine($"{fieldName} cannot be empty. Please try again.");
                    continue;
                }

                if (!decimal.TryParse(input.Trim(), out decimal amount))
                {
                    Console.WriteLine($"Invalid amount. Please enter a valid number. Please try again.");
                    continue;
                }

                if (amount <= 0)
                {
                    Console.WriteLine($"Amount must be greater than zero. Please try again.");
                    continue;
                }

                return amount;
            }
        }
    }
}