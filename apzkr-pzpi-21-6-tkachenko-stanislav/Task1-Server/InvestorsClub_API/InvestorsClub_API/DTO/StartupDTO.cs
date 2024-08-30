using InvestorsClub_API.Enums;

namespace InvestorsClub_API.DTO
{
    public class StartupDTO
    {
        public int ID { get; set; }
        public UserDTO Founder { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DevelopmentStage? DevelopmentStage { get; set; }
        public string? DocumentPath { get; set; }
        public decimal? RequiredBudget { get; set; }
        public InvestorTypes DesiredInvestorType { get; set; }
        public int? Deadline { get; set; }
    }
}
