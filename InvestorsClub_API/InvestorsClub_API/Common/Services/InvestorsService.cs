using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DBContext;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace InvestorsClub_API.Common.Services
{
    public class InvestorsService : IInvestorsService
    {
        private readonly InvestorsClubContext _context;

        public InvestorsService(InvestorsClubContext context)
        {
            _context = context;
        }

        public async Task<bool> AddInvestorAsync(Investors investor)
        {
            if (investor != null)
            {
                _context.Investors.Add(investor);
                await _context.SaveChangesAsync();

                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<InvestorDTO> GetInvestorByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            InvestorDTO investorDTO = null;
            
            if(user != null)
            {
                var investor = await _context.Investors.FirstOrDefaultAsync(inv => inv.UserID == user.ID);

                if(investor != null)
                {
                    investorDTO = new InvestorDTO()
                    {
                        ID = investor.ID,
                        InvestorInfo = new UserDTO()
                        {
                            ID = user.ID,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = email,
                            PhoneNumber = user.PhoneNumber,
                            PhotoUrl = user.PhotoUrl,
                            Banned = user.Banned,
                            Deleted = user.Deleted,
                            Role = user.Role
                        },
                        InterestsAndPreferences = investor.InterestsAndPreferences,
                        InvestorType = investor.InvestorType,
                        Budget = investor.Budget,
                    };
                }
            }

            return investorDTO;
        }

        public async Task<InvestorDTO> GetInvestorByIdAsync(int id)
        {
            var investor = await _context.Investors.FindAsync(id);
            InvestorDTO investorDTO = null;

            if (investor != null)
            {
                var user = await _context.Users.FindAsync(investor.UserID);

                if (investor != null)
                {
                    investorDTO = new InvestorDTO()
                    {
                        ID = investor.ID,
                        InvestorInfo = new UserDTO()
                        {
                            ID = user.ID,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            PhoneNumber = user.PhoneNumber,
                            PhotoUrl = user.PhotoUrl,
                            Banned = user.Banned,
                            Deleted = user.Deleted,
                            Role = user.Role
                        },
                        InterestsAndPreferences = investor.InterestsAndPreferences,
                        InvestorType = investor.InvestorType,
                        Budget = investor.Budget,
                    };
                }
            }

            return investorDTO;
        }
    }
}
