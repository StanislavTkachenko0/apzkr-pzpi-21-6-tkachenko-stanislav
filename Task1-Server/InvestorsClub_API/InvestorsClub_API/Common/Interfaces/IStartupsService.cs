using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;

namespace InvestorsClub_API.Common.Interfaces
{
    public interface IStartupsService
    {
        public Task<bool> CreateStartup(Startups startup);
        public Task<StartupDTO> GetStartupById(int startupId);
        public Task<bool> EditStartup(StartupDTO startup);
        public Task<DeletingResult> DeleteStartupById(int startupId);
        public Task<IEnumerable<StartupDTO>> GetStartups(string email);
        public Task<IEnumerable<StartupDTO>> GetStartupsByFounder(int id);
    }
}
