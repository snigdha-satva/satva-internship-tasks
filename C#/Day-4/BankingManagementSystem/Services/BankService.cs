using System;
using System.Configuration;
using AutoMapper;
using BankingManagementSystem.DTOs;
using BankingManagementSystem.Exceptions;
using BankingManagementSystem.Models;
using BankingManagementSystem.Repositories;

namespace BankingManagementSystem.Services
{
    public class BankService
    {
        private readonly IAccountRepository _repository;
        private readonly IMapper _mapper;
        private readonly decimal _interestRate;
        private readonly decimal _maxWithdrawalLimit;

        public BankService(IAccountRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
            _interestRate = decimal.Parse(ConfigurationManager.AppSettings["InterestRate"]);
            _maxWithdrawalLimit = decimal.Parse(ConfigurationManager.AppSettings["MaxWithdrawalLimit"]);
        }

        public void OpenAccount(string holderName, decimal initialDeposit)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(holderName))
                    throw new ArgumentNullException(nameof(holderName), "Holder name is required.");

                if (initialDeposit < 1000)
                    throw new InvalidOperationException("Initial deposit must be at least 1,000.");

                var account = new Account
                {
                    AccountNumber = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(),
                    HolderName = holderName,
                    Balance = initialDeposit
                };

                account.Transactions.Add(new DepositTransaction
                {
                    Amount = initialDeposit,
                    Date = DateTime.Now
                });

                _repository.AddAccount(account);
                Console.WriteLine($"\nAccount opened successfully!");
                Console.WriteLine($"Account Number : {account.AccountNumber}");
                Console.WriteLine($"Holder Name    : {account.HolderName}");
                Console.WriteLine($"Initial Balance: {account.Balance:C}");
            }
            catch (ArgumentNullException ex)
            {
                Console.WriteLine($"\n[Validation Error] {ex.Message}");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"\n[Validation Error] {ex.Message}");
            }
            catch (IOException ex)
            {
                Console.WriteLine($"\n[File Error] {ex.Message}");
            }
        }

        public void PerformTransaction<T>(string accountNumber, decimal amount) where T : Transaction, new()
        {
            try
            {
                if (string.IsNullOrWhiteSpace(accountNumber))
                    throw new ArgumentNullException(nameof(accountNumber), "Account number is required.");

                var account = _repository.GetAccountByNumber(accountNumber);

                if (account == null)
                    throw new ArgumentNullException(nameof(account), $"No account found with number: {accountNumber}");

                if (amount <= 0)
                    throw new InvalidOperationException("Transaction amount must be greater than zero.");

                var transaction = new T { Amount = amount, Date = DateTime.Now };

                if (transaction is DepositTransaction)
                {
                    account.Balance += amount;
                    Console.WriteLine($"\nDeposit of {amount:C} successful. New Balance: {account.Balance:C}");
                }
                else if (transaction is WithdrawTransaction)
                {
                    if (amount > _maxWithdrawalLimit)
                        throw new InvalidOperationException($"Withdrawal exceeds max limit of {_maxWithdrawalLimit:C}.");

                    if (account.Balance < amount)
                        throw new InsufficientBalanceException($"Available balance is {account.Balance:C}, but attempted to withdraw {amount:C}.");

                    account.Balance -= amount;
                    Console.WriteLine($"\nWithdrawal of {amount:C} successful. New Balance: {account.Balance:C}");
                }

                account.Transactions.Add(transaction);
                _repository.UpdateAccount(account);
            }
            catch (ArgumentNullException ex)
            {
                Console.WriteLine($"\n[Validation Error] {ex.Message}");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"\n[Transaction Error] {ex.Message}");
            }
            catch (InsufficientBalanceException ex)
            {
                Console.WriteLine($"\n[Insufficient Balance] {ex.Message}");
            }
            catch (IOException ex)
            {
                Console.WriteLine($"\n[File Error] {ex.Message}");
            }
        }

        public void ApplyMonthlyInterest(string accountNumber)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(accountNumber))
                    throw new ArgumentNullException(nameof(accountNumber), "Account number is required.");

                var account = _repository.GetAccountByNumber(accountNumber);

                if (account == null)
                    throw new ArgumentNullException(nameof(account), $"No account found with number: {accountNumber}");

                decimal interest = account.Balance * _interestRate;
                account.Balance += interest;

                account.Transactions.Add(new InterestTransaction
                {
                    Amount = interest,
                    Date = DateTime.Now
                });

                _repository.UpdateAccount(account);
                Console.WriteLine($"\nMonthly interest of {interest:C} applied. New Balance: {account.Balance:C}");
            }
            catch (ArgumentNullException ex)
            {
                Console.WriteLine($"\n[Validation Error] {ex.Message}");
            }
            catch (IOException ex)
            {
                Console.WriteLine($"\n[File Error] {ex.Message}");
            }
        }

        public void DisplayAccountDetails(string accountNumber)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(accountNumber))
                    throw new ArgumentNullException(nameof(accountNumber), "Account number is required.");

                var account = _repository.GetAccountByNumber(accountNumber);

                if (account == null)
                    throw new ArgumentNullException(nameof(account), $"No account found with number: {accountNumber}");

                AccountDto dto = _mapper.Map<AccountDto>(account);

                Console.WriteLine("\n========== Account Details ==========");
                Console.WriteLine($"Account Number : {dto.AccountNumber}");
                Console.WriteLine($"Holder Name    : {dto.HolderName}");
                Console.WriteLine($"Balance        : {dto.Balance:C}");
                Console.WriteLine("\n--- Transaction History ---");

                if (dto.Transactions == null || dto.Transactions.Count == 0)
                {
                    Console.WriteLine("No transactions found.");
                }
                else
                {
                    foreach (var txn in dto.Transactions)
                    {
                        Console.WriteLine($"  [{txn.Date:yyyy-MM-dd HH:mm:ss}] {txn.TransactionType,-12} : {txn.Amount:C}");
                    }
                }
                Console.WriteLine("=====================================");
            }
            catch (ArgumentNullException ex)
            {
                Console.WriteLine($"\n[Validation Error] {ex.Message}");
            }
            catch (IOException ex)
            {
                Console.WriteLine($"\n[File Error] {ex.Message}");
            }
        }

        public void DisplayAllAccounts()
        {
            try
            {
                var accounts = _repository.GetAllAccounts();

                if (accounts.Count == 0)
                {
                    Console.WriteLine("\nNo accounts found.");
                    return;
                }

                Console.WriteLine("\n========== All Accounts ==========");
                foreach (var acc in accounts)
                {
                    Console.WriteLine($"Account No: {acc.AccountNumber} | Holder: {acc.HolderName} | Balance: {acc.Balance:C}");
                }
                Console.WriteLine("==================================");
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"\n[Data Error] {ex.Message}");
            }
            catch (IOException ex)
            {
                Console.WriteLine($"\n[File Error] {ex.Message}");
            }
        }
    }
}