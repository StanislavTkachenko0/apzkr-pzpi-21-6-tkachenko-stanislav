namespace InvestorsClub_API.Common.Interfaces
{
    public interface IHashService
    {
        public bool VerifyPassword(string enteredPassword, string hashedPassword);

        public string HashPassword(string password);
    }
}

