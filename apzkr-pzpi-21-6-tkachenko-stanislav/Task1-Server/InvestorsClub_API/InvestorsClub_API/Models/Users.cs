using InvestorsClub_API.Enums;

namespace InvestorsClub_API.Models
{
    public class Users
    {
        public int ID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? PhotoUrl { get; set; }
        public bool Deleted { get; set; }
        public bool Banned { get; set; }
        public Roles Role { get; set; }
    }
}
