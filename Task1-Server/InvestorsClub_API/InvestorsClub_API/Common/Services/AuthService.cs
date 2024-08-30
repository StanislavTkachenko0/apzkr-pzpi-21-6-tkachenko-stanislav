using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DBContext;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.EntityFrameworkCore;

namespace InvestorsClub_API.Common.Services
{
    public class AuthService : IAuthService
    {
        private readonly InvestorsClubContext context;
        private readonly IUsersService _userService;
        private readonly IHashService _hashService;

        public AuthService(InvestorsClubContext context, IUsersService userService, IHashService hashService)
        {
            this.context = context;
            this._userService = userService;
            this._hashService = hashService;
        }

        public async Task<Users?> Login(AuthDTO userLogin)
        {
            Users? user = null;

            if (userLogin.Email != "")
            {
                user = await context.Users.FirstOrDefaultAsync(u => u.Email == userLogin.Email);
                await Console.Out.WriteLineAsync(userLogin.Email);
            }

            if (user != null && _hashService.VerifyPassword(userLogin.Password, user.Password) && user.Deleted == false)
            {
                return user;
            }

            return null;
        }

        public async Task<RegistrationResult> Register(Users user)
        {
            if (user == null)
                return RegistrationResult.OtherError;

            var isEmailExists = await context.Users.AnyAsync(u => u.Email == user.Email && !u.Deleted);

            if (isEmailExists)
                return RegistrationResult.EmailExists;

            await _userService.AddUser(user);

            return RegistrationResult.Success;
        }
    }
}
