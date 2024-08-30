using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace InvestorsClub_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IHashService _hashService;
        private readonly IInvestorsService _investorsService;
        private readonly IUsersService _usersService;

        public AuthController(
            IAuthService authService,
            IHashService hashService, 
            IInvestorsService investorsService,
            IUsersService usersService
            )
        {
            this._authService = authService;
            this._hashService = hashService;
            this._investorsService = investorsService;
            this._usersService = usersService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(RegisterDTO registerDTO)
        {

            var user = new Users()
            {
                Email = registerDTO.Email,
                Password = _hashService.HashPassword(registerDTO.Password),
                FirstName = null,
                LastName = null,
                PhoneNumber = null,
                Role = registerDTO.Role
            };


            var registrationResult = await _authService.Register(user);
            
            if (registerDTO.Role == Roles.Investor)
            {
                var newUser = await _usersService.GetUserByEmail(user.Email);
                var res = await _investorsService.AddInvestorAsync(new Investors()
                {
                    UserID = newUser.ID,
                    InterestsAndPreferences = "",
                    InvestorType = registerDTO.InvestorType,
                    Budget = registerDTO.Budget
                });
            }

            if (registrationResult == RegistrationResult.LoginExists)
                return BadRequest("User with this login already exists");

            if (registrationResult == RegistrationResult.EmailExists)
                return BadRequest("User with this email already exists");

            if (registrationResult == RegistrationResult.OtherError)
                return BadRequest("Error during registration");

            return Ok(true);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(AuthDTO authModel)
        {
            var user = await _authService.Login(authModel);

            if (user == null)
            {
                return Unauthorized();
            }

            if (user.Banned)
            {
                return new ObjectResult("Access forbidden")
                {
                    StatusCode = 403
                };
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user
            });

        }

        private string GenerateJwtToken(Users user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(key);
            }
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, user.Email!),
                    new Claim("userId", $"{user.ID}")

                    // Дополнительные утверждения (claims) о пользователе
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
