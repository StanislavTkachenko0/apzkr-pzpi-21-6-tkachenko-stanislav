namespace InvestorsClub_API.DTO
{
    public class ReviewDTO
    {
        public int ID { get; set; }
        public int? StartupId { get; set; }
        public UserDTO? UserInfo { get; set; }
        public string? Text { get; set; }
        public int Rating { get; set; }
    }
}
