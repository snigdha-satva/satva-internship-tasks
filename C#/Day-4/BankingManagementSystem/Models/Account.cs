using System.Collections.Generic;
using System.Xml.Serialization;

namespace BankingManagementSystem.Models
{
    public class Account
    {
        public string AccountNumber { get; set; }
        public string HolderName { get; set; }
        public decimal Balance { get; set; }

        [XmlArray("Transactions")]
        [XmlArrayItem("Transaction")]
        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}