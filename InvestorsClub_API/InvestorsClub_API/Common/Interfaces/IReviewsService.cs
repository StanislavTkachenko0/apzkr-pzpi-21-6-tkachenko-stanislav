using InvestorsClub_API.DTO;
using InvestorsClub_API.Models;

namespace InvestorsClub_API.Common.Interfaces
{
    public interface IReviewsService
    {
        public Task<bool> AddReview(Reviews review);
        public Task<IQueryable<ReviewDTO>> GetReviewsByStartupId(int startupId);
        public Task<int> GetAverageOfReviewsByStartupId(int startupId);
    }
}
