using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;

namespace InvestorsClub_API.Common.Interfaces
{
    public interface IContractService
    {
        public Task<bool> CreateContract(Contracts contract);
        public Task<ContractDTO> GetContractById(int id);
        public Task<IEnumerable<ContractDTO>> GetContractsByEmail(string email);
        public Task<DeletingResult> DeleteContractById(int id);

        public Task<bool> UpdateContractStatus(int id, Statuses status);
    }
}
