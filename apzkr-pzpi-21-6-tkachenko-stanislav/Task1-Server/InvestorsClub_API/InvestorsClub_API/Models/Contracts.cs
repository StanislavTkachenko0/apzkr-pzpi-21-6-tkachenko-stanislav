using InvestorsClub_API.Enums;

namespace InvestorsClub_API.Models
{
    public class Contracts
    {
        public int ID { get; set; }
        public int InvestorID { get; set; }
        public int StartupID { get; set; }
        public decimal InvestmentAmount { get; set; }
        public int InvestmentTerm { get; set; }
        public Statuses Status { get; set; }
    }
}
