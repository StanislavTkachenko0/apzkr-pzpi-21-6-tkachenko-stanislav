using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DBContext;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvestorsClub_API.Common.Services
{
    public class StartupsService : IStartupsService
    {
        private readonly InvestorsClubContext _context;
        private readonly IUsersService _usersService;
        private readonly  IRecomendationService _recomendationService;

        public StartupsService(
            InvestorsClubContext context,
            IUsersService usersService,
            IRecomendationService recomendationService
            )
        {
            _context = context;
            _usersService = usersService;
            _recomendationService = recomendationService;
        }

        public async Task<bool> CreateStartup(Startups startup)
        {
            if (startup != null)
            {
                _context.Startups.Add(startup);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<DeletingResult> DeleteStartupById(int startupId)
        {
            await DeleteDependenciesOfStratup(startupId);
          
            var startup = await _context.Startups.FindAsync(startupId);
            if (startup == null)
                return DeletingResult.ItemNotFound;

            _context.Startups.Remove(startup);
            await _context.SaveChangesAsync();

            return DeletingResult.Success;
        }

        public async Task<StartupDTO> GetStartupById(int startupId)
        {
            var startup = await _context.Startups.FirstOrDefaultAsync(st => st.ID == startupId);

            if(startup != null ) 
            {
                var user = await _usersService.GetUserById(startup.FounderID);

                if(user != null) 
                {
                    return new StartupDTO()
                    {
                        ID = startup.ID,
                        Founder = new UserDTO()
                        {
                            ID = user.ID,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            PhotoUrl = user.PhotoUrl,
                            PhoneNumber = user.PhoneNumber,
                            Banned = user.Banned,
                            Deleted = user.Deleted,
                            Role = user.Role
                        },
                        Name = startup.Name,
                        Description = startup.Description,
                        DevelopmentStage = startup.DevelopmentStage,
                        DocumentPath = startup.DocumentPath,
                        DesiredInvestorType = startup.DesiredInvestorType,
                        Deadline = startup.Deadline,
                        RequiredBudget = startup.RequiredBudget
                    };
                }

                return null;
            }

            return null;
        }

        public async Task<IEnumerable<StartupDTO>> GetStartups(string? email)
        {
            var startups = await _context.Startups.ToListAsync();
            List<StartupDTO> startupsDTO = new List<StartupDTO>();

            if (startups.Any())
            {
                foreach (var st in startups)
                {
                    var founder = await _context.Users.FirstOrDefaultAsync(u => u.ID == st.FounderID);

                    startupsDTO.Add(new StartupDTO
                    {
                        ID = st.ID,
                        Deadline = st.Deadline,
                        Description = st.Description,
                        DevelopmentStage = st.DevelopmentStage,
                        DocumentPath = st.DocumentPath,
                        Name = st.Name,
                        RequiredBudget = st.RequiredBudget,
                        DesiredInvestorType = st.DesiredInvestorType,
                        Founder = new UserDTO
                        {
                            ID = founder.ID,
                            Banned = founder.Banned,
                            Deleted = founder.Deleted,
                            Email = founder.Email,
                            FirstName = founder.FirstName,
                            LastName = founder.LastName,
                            PhoneNumber = founder.PhoneNumber,
                            PhotoUrl = founder.PhotoUrl,
                            Role = founder.Role
                        }
                    });
                }
            }

            return email.Length == 0 ? startupsDTO : await _recomendationService.SortStartupsByRecommendations(startupsDTO, email);
        }

        public async Task<IEnumerable<StartupDTO>> GetStartupsByFounder(int id)
        {
            var startups = await _context.Startups.Where(s => s.FounderID == id).ToListAsync();
            List<StartupDTO> startupsDTO = new List<StartupDTO>();

            if (startups.Any())
            {
                foreach (var st in startups)
                {
                    var founder = await _context.Users.FirstOrDefaultAsync(u => u.ID == st.FounderID);

                    startupsDTO.Add(new StartupDTO
                    {
                        ID = st.ID,
                        Deadline = st.Deadline,
                        Description = st.Description,
                        DevelopmentStage = st.DevelopmentStage,
                        DocumentPath = st.DocumentPath,
                        Name = st.Name,
                        RequiredBudget = st.RequiredBudget,
                        DesiredInvestorType = st.DesiredInvestorType,
                        Founder = new UserDTO
                        {
                            ID = founder.ID,
                            Banned = founder.Banned,
                            Deleted = founder.Deleted,
                            Email = founder.Email,
                            FirstName = founder.FirstName,
                            LastName = founder.LastName,
                            PhoneNumber = founder.PhoneNumber,
                            PhotoUrl = founder.PhotoUrl,
                            Role = founder.Role
                        }
                    });
                }
            }

            return startupsDTO;
        }

        public async Task<bool> EditStartup(StartupDTO startup)
        {
            if (startup == null)
            {
                return false;
            }

            try
            {
                var existingStartup = await _context.Startups.FindAsync(startup.ID);

                if (existingStartup == null)
                {
                    return false;
                }

                existingStartup.Name = startup.Name;
                existingStartup.DocumentPath = startup.DocumentPath;
                existingStartup.DevelopmentStage = startup.DevelopmentStage;
                existingStartup.Deadline = startup.Deadline;
                existingStartup.Description = startup.Description;

                _context.Startups.Update(existingStartup);
                await _context.SaveChangesAsync();

                return true;

            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private async Task DeleteDependenciesOfStratup(int startupId)
        {
            var investmentRequests = await _context.InvestmentRequests.Where(ir => ir.StartupID == startupId).ToListAsync();
            _context.InvestmentRequests.RemoveRange(investmentRequests);
            await _context.SaveChangesAsync();

            var contracts = await _context.Contracts.Where(ir => ir.StartupID == startupId).ToListAsync();
            _context.Contracts.RemoveRange(contracts);
            await _context.SaveChangesAsync();

            var reviews = await _context.Reviews.Where(ir => ir.StartupID == startupId).ToListAsync();
            _context.Reviews.RemoveRange(reviews);
            await _context.SaveChangesAsync();
        }
    }
}
