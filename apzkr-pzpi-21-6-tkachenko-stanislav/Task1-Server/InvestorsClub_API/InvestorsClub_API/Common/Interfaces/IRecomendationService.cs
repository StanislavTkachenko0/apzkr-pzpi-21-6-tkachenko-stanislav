using InvestorsClub_API.Common.Services;
using InvestorsClub_API.DTO;

namespace InvestorsClub_API.Common.Interfaces
{
    public interface IRecomendationService
    {
        public Task<IEnumerable<StartupDTO>> SortStartupsByRecommendations(IEnumerable<StartupDTO> startups, string email);
    }
}
