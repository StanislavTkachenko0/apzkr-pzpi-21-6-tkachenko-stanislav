using InvestorsClub_API.DTO;
using InvestorsClub_API.Models;

namespace InvestorsClub_API.Common.Interfaces
{
    public interface IInvestorsService
    {
        public Task<bool> AddInvestorAsync(Investors investor);
        public Task<InvestorDTO> GetInvestorByEmailAsync(string email);
        public Task<InvestorDTO> GetInvestorByIdAsync(int id);
    }
}
