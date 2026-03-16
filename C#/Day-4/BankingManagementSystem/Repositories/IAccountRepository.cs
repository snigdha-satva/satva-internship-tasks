using System.Collections.Generic;
using BankingManagementSystem.Models;

namespace BankingManagementSystem.Repositories
{
    public interface IAccountRepository
    {
        List<Account> GetAllAccounts();
        Account GetAccountByNumber(string accountNumber);
        void AddAccount(Account account);
        void UpdateAccount(Account account);
    }
}