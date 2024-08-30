using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;

namespace InvestorsClub_API.Common.Interfaces
{
    public interface IInvestmentRequestService
    {
        public Task<bool> CreateInvestmentRequest(InvestmentRequests request);
        public Task<InvestmentRequestDTO> GetInvestmentRequestById(int id);
        public Task<IEnumerable<InvestmentRequestDTO>> GetInvestmentRequestsByInvestorEmail(string email);
        public Task<DeletingResult> DeleteInvestmentRequestById(int id);
    }
}
