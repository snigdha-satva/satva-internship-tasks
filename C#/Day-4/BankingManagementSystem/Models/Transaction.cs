using System;
using System.Xml.Serialization;

namespace BankingManagementSystem.Models
{
    [XmlInclude(typeof(DepositTransaction))]
    [XmlInclude(typeof(WithdrawTransaction))]
    [XmlInclude(typeof(InterestTransaction))]
    public abstract class Transaction
    {
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string TransactionType { get; set; }
    }

    public class DepositTransaction : Transaction
    {
        public DepositTransaction()
        {
            TransactionType = "Deposit";
        }
    }

    public class WithdrawTransaction : Transaction
    {
        public WithdrawTransaction()
        {
            TransactionType = "Withdrawal";
        }
    }

    public class InterestTransaction : Transaction
    {
        public InterestTransaction()
        {
            TransactionType = "Interest";
        }
    }
}