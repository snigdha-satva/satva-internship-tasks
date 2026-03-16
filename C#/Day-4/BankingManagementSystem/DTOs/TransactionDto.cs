using System;

namespace BankingManagementSystem.DTOs
{
    public class TransactionDto
    {
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string TransactionType { get; set; }
    }
}