using InvestorsClub_API.Common.Interfaces;

namespace InvestorsClub_API.Common.Services
{
    public class HashService : IHashService
    {
        public bool VerifyPassword(string enteredPassword, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, hashedPassword);
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
