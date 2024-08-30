namespace InvestorsClub_API.Models
{
    public class News
    {
        public int ID { get; set; }
        public int? StartupID { get; set; }
        public string? Headline { get; set; }
        public string? Text { get; set; }
        public string? PhotoUrl { get; set; }
        public DateTime PublicationDate { get; set; }
    }
}
