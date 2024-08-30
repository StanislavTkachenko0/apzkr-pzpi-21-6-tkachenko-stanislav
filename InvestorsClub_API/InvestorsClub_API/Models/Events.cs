using InvestorsClub_API.Enums;

namespace InvestorsClub_API.Models
{
    public class Events
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateTime { get; set; }
        public string Location { get; set; }
        public Statuses Status { get; set; }
        public string RegistrationLink { get; set; }
    }
}
