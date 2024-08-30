using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;

namespace InvestorsClub_API.Common.Interfaces
{
    public interface IAuthService
    {
        public Task<Users?> Login(AuthDTO login);
        public Task<RegistrationResult> Register(Users user);
    }
}
