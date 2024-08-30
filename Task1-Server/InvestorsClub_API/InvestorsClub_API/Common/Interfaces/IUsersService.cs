using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;

namespace InvestorsClub_API.Common.Interfaces
{
    public interface IUsersService
    {
        public Task<Users> AddUser(Users user);

        public Task<IEnumerable<Users?>> GetUsers();
        public Task<UserDTO?> GetUserById(int Id);
        public Task<UserDTO?> GetUserByEmail(string email);

        public Task<DeletingResult> DeleteUser(int userId);
        public Task<bool> BanUser(int userId);
    }
}
