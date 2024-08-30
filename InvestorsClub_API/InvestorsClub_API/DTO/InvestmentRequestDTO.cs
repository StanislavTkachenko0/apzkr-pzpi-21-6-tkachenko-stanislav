namespace InvestorsClub_API.DTO
{
    public class InvestmentRequestDTO
    {
        public int ID { get; set; }
        public StartupDTO? StartupInfo { get; set; }
        public InvestorDTO InvestorInfo { get; set; }
        public decimal InvestmentAmount { get; set; }
        public int InvestmentTerm { get; set; }
    }
}
