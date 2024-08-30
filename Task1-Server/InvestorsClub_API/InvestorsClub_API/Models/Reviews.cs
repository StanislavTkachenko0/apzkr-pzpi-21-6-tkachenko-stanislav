namespace InvestorsClub_API.Models
{
    public class Reviews
    {
        public int ID { get; set; }
        public int StartupID { get; set; }
        public int UserID { get; set; }
        public string? Text { get; set; }
        public int Rating { get; set; }
    }
}
