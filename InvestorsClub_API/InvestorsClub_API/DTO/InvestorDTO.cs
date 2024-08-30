using InvestorsClub_API.Enums;

namespace InvestorsClub_API.DTO
{
    public class InvestorDTO
    {
        public int ID { get; set; }
        public UserDTO InvestorInfo { get; set; }
        public InvestorTypes? InvestorType { get; set; }
        public string? InterestsAndPreferences { get; set; }
        public decimal? Budget { get; set; }
    }
}
