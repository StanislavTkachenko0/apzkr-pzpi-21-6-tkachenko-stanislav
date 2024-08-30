using InvestorsClub_API.Enums;

namespace InvestorsClub_API.DTO
{
    public class RegisterDTO
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public Roles Role { get; set; }
        public InvestorTypes? InvestorType { get; set; }
        public decimal? Budget { get; set; }
    }
}
