using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.Common.Services;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvestorsClub_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService) 
        {
            _usersService = usersService;
        }

        [HttpGet]
        [Route("users")]
        public async Task<IEnumerable<Users>> GetUsers()
        {
            var users = await _usersService.GetUsers();

            return users;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUserById(int id)
        {
            var user = await _usersService.GetUserById(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _usersService.DeleteUser(id);

            if (result == DeletingResult.Success)
                return Ok();
            if (result == DeletingResult.ItemNotFound)
                return NotFound();

            return NoContent();
        }

        [HttpPost("ban/{id}")]
        public async Task<IActionResult> BanUser(int id)
        {
            bool result = await _usersService.BanUser(id);
            if (result == false)
                return BadRequest("User not found or have already been banned");
            return Ok();
        }
    }
}
