using AutoMapper;
using BankingManagementSystem.DTOs;
using BankingManagementSystem.Models;

namespace BankingManagementSystem.Mappings
{
    public class BankProfile : Profile
    {
        public BankProfile()
        {
            CreateMap<Account, AccountDto>();
            CreateMap<Transaction, TransactionDto>()
                .ForMember(dest => dest.TransactionType, opt => opt.MapFrom(src => src.TransactionType));
        }
    }
}