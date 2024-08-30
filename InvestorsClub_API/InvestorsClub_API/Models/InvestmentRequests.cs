namespace InvestorsClub_API.Models
{
    public class InvestmentRequests
    {
        public int ID { get; set; }
        public int StartupID { get; set; }
        public int InvestorID { get; set; }
        public decimal InvestmentAmount { get; set; }
        public int InvestmentTerm { get; set; }
    }
}
