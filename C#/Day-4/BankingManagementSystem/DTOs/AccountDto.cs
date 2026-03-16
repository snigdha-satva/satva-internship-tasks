using System.Collections.Generic;

namespace BankingManagementSystem.DTOs
{
    public class AccountDto
    {
        public string AccountNumber { get; set; }
        public string HolderName { get; set; }
        public decimal Balance { get; set; }
        public List<TransactionDto> Transactions { get; set; }
    }
}