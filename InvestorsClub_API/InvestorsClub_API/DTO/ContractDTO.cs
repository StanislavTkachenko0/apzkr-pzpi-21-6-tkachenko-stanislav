using InvestorsClub_API.Enums;

namespace InvestorsClub_API.DTO
{
    public class ContractDTO
    {
        public int ID { get; set; }
        public StartupDTO? StartupInfo { get; set; }
        public InvestorDTO InvestorInfo { get; set; }
        public UserDTO? UserInfo { get; set; }
        public decimal InvestmentAmount { get; set; }
        public int InvestmentTerm { get; set; }
        public Statuses Status { get; set; }
    }
}
