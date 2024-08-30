using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DBContext;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.EntityFrameworkCore;

namespace InvestorsClub_API.Common.Services
{
    public class InvestmentRequestService : IInvestmentRequestService
    {
        private readonly IStartupsService _startupService;
        private readonly IInvestorsService _investorsService;
        private readonly IUsersService _usersService;

        public InvestmentRequestService(
            IStartupsService startupsService,
            IInvestorsService investorsService,
            IUsersService usersService
            ) { 
            _startupService = startupsService;
            _investorsService = investorsService;
            _usersService = usersService;  
        }

        public async Task<bool> CreateInvestmentRequest(InvestmentRequests request)
        {
            try
            {
                using (var context = new InvestorsClubContext())
                {
                    context.InvestmentRequests.Add(request);

                    await context.SaveChangesAsync();

                    return true;
                }
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        public async Task<DeletingResult> DeleteInvestmentRequestById(int id)
        {
            try
            {
                using (var context = new InvestorsClubContext())
                {
                    var invReq = await context.InvestmentRequests.FindAsync(id);

                    if(invReq != null) 
                    {
                        context.InvestmentRequests.Remove(invReq);

                        await context.SaveChangesAsync();

                        return DeletingResult.Success;
                    }

                    return DeletingResult.ItemNotFound;
                } 
            }
            catch (Exception ex)
            {
                return DeletingResult.Failure;
            }
        }

        public async Task<InvestmentRequestDTO> GetInvestmentRequestById(int id)
        {
            try
            {
                using (var context = new InvestorsClubContext())
                {
                    var invReq = await context.InvestmentRequests.FindAsync(id);

                    if (invReq != null)
                    {
                        return new InvestmentRequestDTO()
                        {
                            ID = invReq.ID,
                            InvestorInfo = await _investorsService.GetInvestorByIdAsync(invReq.InvestorID),
                            StartupInfo = await _startupService.GetStartupById(invReq.StartupID),
                            InvestmentAmount = invReq.InvestmentAmount,
                            InvestmentTerm = invReq.InvestmentTerm
                        };
                    }

                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentNullException(ex.Message, ex);
            }
        }

        public async Task<IEnumerable<InvestmentRequestDTO>> GetInvestmentRequestsByInvestorEmail(string email)
        {
            try
            {
                using (var context = new InvestorsClubContext())
                {
                    var investor = await _investorsService.GetInvestorByEmailAsync(email);

                    if (investor != null)
                    {
                        var invReqs = await context.InvestmentRequests.Where(inv => inv.InvestorID == investor.ID).ToListAsync();
                        List<InvestmentRequestDTO> invReqsDTO = new List<InvestmentRequestDTO>();

                        if (invReqs.Any())
                        {
                            foreach (var invereq in invReqs)
                            {
                                invReqsDTO.Add(new InvestmentRequestDTO()
                                {
                                    ID = invereq.ID,
                                    InvestorInfo = investor,
                                    StartupInfo = await _startupService.GetStartupById(invereq.StartupID),
                                    InvestmentAmount = invereq.InvestmentAmount,
                                    InvestmentTerm = invereq.InvestmentTerm
                                });
                            }

                            return invReqsDTO;
                        }

                        return invReqsDTO;
                    }
                    else
                    {
                        var user = await _usersService.GetUserByEmail(email);

                        if (user != null)
                        {
                            var startupsOfUser = await _startupService.GetStartupsByFounder(user.ID);
                            var startupIds = startupsOfUser.Select(s => s.ID).ToList();

                            var invReqs = await context.InvestmentRequests
                                                            .Where(inv => startupIds.Contains(inv.StartupID))
                                                            .ToListAsync();

                            List<InvestmentRequestDTO> invReqsDTO = new List<InvestmentRequestDTO>();

                            if (invReqs.Any())
                            {
                                foreach (var invereq in invReqs)
                                {
                                    invReqsDTO.Add(new InvestmentRequestDTO()
                                    {
                                        ID = invereq.ID,
                                        InvestorInfo = await _investorsService.GetInvestorByIdAsync(invereq.InvestorID),
                                        StartupInfo = await _startupService.GetStartupById(invereq.StartupID),
                                        InvestmentAmount = invereq.InvestmentAmount,
                                        InvestmentTerm = invereq.InvestmentTerm
                                    });
                                }

                                return invReqsDTO;
                            }

                            return invReqsDTO;
                        }
                    }

                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentNullException(ex.Message, ex);
            }
        }
    }
}
