using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DBContext;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Models;
using Microsoft.EntityFrameworkCore;

namespace InvestorsClub_API.Common.Services
{
    public class ReviewsService : IReviewsService
    {
        private readonly InvestorsClubContext _context;
        private readonly IUsersService _usersService;

        public ReviewsService(
            InvestorsClubContext context,
            IUsersService usersService
            )
        {
            _context = context;
            _usersService = usersService;
        }

        public async Task<bool> AddReview(Reviews review)
        {
            if (review != null)
            {
                _context.Reviews.Add(review);

                await _context.SaveChangesAsync();

                return true;
            }

            return false;
        }

        public async Task<IQueryable<ReviewDTO>> GetReviewsByStartupId(int startupId)
        {
            var reviews = await _context.Reviews.Where(r => r.StartupID == startupId).ToListAsync();
            List<ReviewDTO> reviewsDTO = new List<ReviewDTO>();

            foreach (var review in reviews)
            {
                UserDTO user = await _usersService.GetUserById(review.UserID);

                if (user != null)
                {
                    reviewsDTO.Add(new ReviewDTO()
                    {
                        ID = review.ID,
                        UserInfo = user,
                        StartupId = review.StartupID,
                        Rating = review.Rating,
                        Text = review.Text
                    });
                }
            }


            return reviewsDTO.AsQueryable<ReviewDTO>();
        }

        public async Task<int> GetAverageOfReviewsByStartupId(int startupId)
        {
            var reviews = await _context.Reviews.Where(r => r.StartupID == startupId).ToListAsync();

            if (reviews.Any())
            {
                double averageRating = reviews.Average(r => r.Rating);
                int roundedAverageRating = (int)Math.Round(averageRating);
                return roundedAverageRating;
            }
            else
            {
                return 0; 
            }
        }
    }
}
