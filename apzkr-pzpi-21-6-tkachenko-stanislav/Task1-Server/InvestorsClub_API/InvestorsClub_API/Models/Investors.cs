using InvestorsClub_API.Enums;

namespace InvestorsClub_API.Models
{
    public class Investors
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public InvestorTypes? InvestorType { get; set; }
        public string? InterestsAndPreferences { get; set; }
        public decimal? Budget { get; set; }
    }
}
