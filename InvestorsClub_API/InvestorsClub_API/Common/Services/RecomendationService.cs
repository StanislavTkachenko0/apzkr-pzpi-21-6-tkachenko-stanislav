using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;

namespace InvestorsClub_API.Common.Services
{
    public class RecomendationService : IRecomendationService
    {
        private readonly IInvestorsService _investorsService;
        private readonly IReviewsService _reviewsService;

        public RecomendationService(
            IInvestorsService investorsService,
            IReviewsService reviewsService
            ) 
        {
            _investorsService = investorsService;
            _reviewsService = reviewsService;
        }

        /// <summary>
        ///    Returns sorted startups from the most suitable to the investor to the most unsuitable ones.
        /// </summary>
        public async Task<IEnumerable<StartupDTO>> SortStartupsByRecommendations(IEnumerable<StartupDTO> startups, string email)
        {
            var investor = await _investorsService.GetInvestorByEmailAsync(email);

            if (investor != null)
            {
                List<StartupsWithScore> startupsWithScores = new List<StartupsWithScore>();

                foreach (var s in startups)
                {
                    var startupWithScore = new StartupsWithScore()
                    {
                        Score = await CalculateRelevanceScore(s, investor),
                        Startup = s
                    };

                    startupsWithScores.Add(startupWithScore);
                }

                startups = startupsWithScores.OrderByDescending(item => item.Score).Select(item => item.Startup);
            }

            return startups;
        }

        /// <summary>
        ///     Counts scores that specify a set of matching criteria.
        ///     Returns scores after algorithmic similarity checks.
        /// </summary>
        private async Task<double> CalculateRelevanceScore(StartupDTO startup, InvestorDTO investor)
        {
            var reviews = await _reviewsService.GetReviewsByStartupId(startup.ID);
            double relevanceScore = 0;
            int sumOfRating = 0;

            // Budget comparison
            if (startup.RequiredBudget.HasValue && investor.Budget >= startup.RequiredBudget)
            {
                double budgetDifference = (double)(investor.Budget - startup.RequiredBudget.Value);

                double maxBudgetDifference = 0.5 * (double)investor.Budget;

                double budgetWeight = budgetDifference / maxBudgetDifference;

                relevanceScore += budgetWeight;
            }

            // Comparison by investor type
            if (investor.InvestorType == startup.DesiredInvestorType)
            {
                relevanceScore += 2;
            }

            // Comparison by stage of development
            switch (startup.DevelopmentStage)
            {
                case DevelopmentStage.IdeaStage:
                    relevanceScore += 1;
                    break;
                case DevelopmentStage.LaunchStage:
                    relevanceScore += 2;
                    break;
                case DevelopmentStage.EarlyStage:
                    relevanceScore += 3;
                    break;
                case DevelopmentStage.GrowthStage:
                    relevanceScore += 4;
                    break;
                case DevelopmentStage.MatureStage:
                    relevanceScore += 5;
                    break;
            }

            //startup ranking comparison
            foreach ( var review in reviews )
            {
                sumOfRating += review.Rating;
            }

            relevanceScore += sumOfRating > 0 ? sumOfRating / reviews.Count() : 0;


            // Comparison by investment term
            if (startup.Deadline.HasValue)
            {
                //  The shorter the investment period, the more points
                relevanceScore += 1 / startup.Deadline.Value;
            }

            await Console.Out.WriteLineAsync($"{relevanceScore}");

            return relevanceScore;
        }
    }
}
