using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using BankingManagementSystem.Helpers;
using BankingManagementSystem.Models;

namespace BankingManagementSystem.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly string _filePath;

        public AccountRepository()
        {
            _filePath = ConfigurationManager.AppSettings["BankFilePath"];
        }

        public List<Account> GetAllAccounts()
        {
            try
            {
                return SerializationHelper.DeserializeFromXml<List<Account>>(_filePath) ?? new List<Account>();
            }
            catch (FileNotFoundException)
            {
                return new List<Account>();
            }
            catch (InvalidOperationException ex)
            {
                throw new InvalidOperationException("Failed to load account data. The file may be corrupted.", ex);
            }
        }

        public Account GetAccountByNumber(string accountNumber)
        {
            var accounts = GetAllAccounts();
            return accounts.FirstOrDefault(a => a.AccountNumber == accountNumber);
        }

        public void AddAccount(Account account)
        {
            var accounts = GetAllAccounts();
            accounts.Add(account);
            SerializationHelper.SerializeToXml(accounts, _filePath);
        }

        public void UpdateAccount(Account account)
        {
            var accounts = GetAllAccounts();
            int index = accounts.FindIndex(a => a.AccountNumber == account.AccountNumber);

            if (index != -1)
            {
                accounts[index] = account;
                SerializationHelper.SerializeToXml(accounts, _filePath);
            }
        }
    }
}