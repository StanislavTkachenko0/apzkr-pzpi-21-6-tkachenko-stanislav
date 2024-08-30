using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DBContext;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvestorsClub_API.Common.Services
{
    public class UsersService : IUsersService
    {
        private readonly InvestorsClubContext _context;

        public UsersService(InvestorsClubContext context)
        {
            this._context = context;
        }

        public async Task<Users> AddUser(Users user)
        {
            if (user != null)
            {
                _context.Users.Add(user);
            }
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<IEnumerable<Users?>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            return users;
        }

        public async Task<UserDTO?> GetUserById(int Id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ID == Id);
            UserDTO userDTO = null;

            if(user != null)
            {
                userDTO = new UserDTO()
                {
                    ID = user.ID,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Banned = user.Banned,
                    Deleted = user.Deleted,
                    PhoneNumber = user.PhoneNumber,
                    PhotoUrl = user.PhotoUrl,
                    Role = user.Role
                };

                return userDTO;
            }

            return null;
        }

        public async Task<UserDTO?> GetUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            UserDTO userDTO = null;

            if (user != null)
            {
                userDTO = new UserDTO()
                {
                    ID = user.ID,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Banned = user.Banned,
                    Deleted = user.Deleted,
                    PhoneNumber = user.PhoneNumber,
                    PhotoUrl = user.PhotoUrl,
                    Role = user.Role
                };

                return userDTO;
            }

            return null;
        }

        public async Task<DeletingResult> DeleteUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return DeletingResult.ItemNotFound;

            if (user.Deleted == true)
                return DeletingResult.ItemNotFound;

            user.Deleted = true;
            await _context.SaveChangesAsync();

            return DeletingResult.Success;
        }

        public async Task<bool> BanUser(int userId)
        {
            var user = await _context.Users.Where(e => e.ID == userId && e.Deleted == false && e.Banned == false).FirstOrDefaultAsync();
            if (user == null)
                return false;
            user.Banned = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
