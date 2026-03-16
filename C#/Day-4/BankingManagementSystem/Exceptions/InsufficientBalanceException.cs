using System;

namespace BankingManagementSystem.Exceptions
{
    public class InsufficientBalanceException : Exception
    {
        public InsufficientBalanceException() 
            : base("Insufficient balance. Cannot complete this withdrawal.") { }

        public InsufficientBalanceException(string message) 
            : base(message) { }

        public InsufficientBalanceException(string message, Exception innerException) 
            : base(message, innerException) { }
    }
}