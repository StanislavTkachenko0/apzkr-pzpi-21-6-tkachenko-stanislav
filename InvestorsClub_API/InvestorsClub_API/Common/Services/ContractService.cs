using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DBContext;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvestorsClub_API.Common.Services
{
    public class ContractService : IContractService
    {
        private readonly IStartupsService _startupService;
        private readonly IInvestorsService _investorsService;
        private readonly IUsersService _usersService;

        public ContractService(
            IStartupsService startupsService,
            IInvestorsService investorsService,
            IUsersService usersService
            )
        {
            _startupService = startupsService;
            _investorsService = investorsService;
            _usersService = usersService;
        }

        public async Task<bool> CreateContract(Contracts contract)
        {
            try
            {
                using (var context = new InvestorsClubContext())
                {
                    context.Contracts.Add(contract);

                    await context.SaveChangesAsync();

                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> UpdateContractStatus(int id, Statuses status)
        {
            try
            {
                using (var context = new InvestorsClubContext())
                {
                    var findContract = await context.Contracts.FindAsync(id);

                    if (findContract != null)
                    {
                        context.Contracts.Attach(findContract);

                        findContract.Status = status;

                        await context.SaveChangesAsync();

                        return true;
                    }

                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<DeletingResult> DeleteContractById(int id)
        {
            try
            {
                using (var context = new InvestorsClubContext())
                {
                    var contract = await context.Contracts.FindAsync(id);

                    if (contract != null)
                    {
                        context.Contracts.Remove(contract);

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

        public async Task<ContractDTO> GetContractById(int id)
        {
            try
            {
                using (var context = new InvestorsClubContext())
                {
                    var contract = await context.Contracts.FindAsync(id);
                    
                    if (contract != null)
                    {
                        return new ContractDTO()
                        {
                            ID = contract.ID,
                            InvestorInfo = await _investorsService.GetInvestorByIdAsync(contract.ID),
                            StartupInfo = await _startupService.GetStartupById(contract.StartupID),
                            InvestmentAmount = contract.InvestmentAmount,
                            InvestmentTerm = contract.InvestmentTerm,
                            Status = contract.Status,
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

        public async Task<IEnumerable<ContractDTO>> GetContractsByEmail(string email)
        {
            try
            {
                using (var context = new InvestorsClubContext())
                {
                    var investor = await _investorsService.GetInvestorByEmailAsync(email);

                    if (investor != null)
                    {
                        var contracts = await context.Contracts.Where(c => c.InvestorID == investor.ID).ToListAsync();
                        List<ContractDTO> contractsDTO = new List<ContractDTO>();

                        if (contracts.Any())
                        {
                            foreach (var contract in contracts)
                            {
                                contractsDTO.Add(new ContractDTO()
                                {
                                    ID = contract.ID,
                                    InvestorInfo = investor,
                                    StartupInfo = await _startupService.GetStartupById(contract.StartupID),
                                    InvestmentAmount = contract.InvestmentAmount,
                                    InvestmentTerm = contract.InvestmentTerm,
                                    Status = contract.Status
                                });
                            }

                            return contractsDTO;
                        }
                    } else
                    {
                        var user = await _usersService.GetUserByEmail(email);

                        if (user != null)
                        {
                            var startupsOfUser = await _startupService.GetStartupsByFounder(user.ID);
                            var startupIds = startupsOfUser.Select(s => s.ID).ToList();

                            var contracts = await context.Contracts
                                                            .Where(c => startupIds.Contains(c.StartupID))
                                                            .ToListAsync();

                            List<ContractDTO> contractsDTO = new List<ContractDTO>();

                            if (contracts.Any())
                            {
                                foreach (var contract in contracts)
                                {
                                    contractsDTO.Add(new ContractDTO()
                                    {
                                        ID = contract.ID,
                                        InvestorInfo = await _investorsService.GetInvestorByIdAsync(contract.InvestorID),
                                        StartupInfo = await _startupService.GetStartupById(contract.StartupID),
                                        UserInfo = user,
                                        InvestmentAmount = contract.InvestmentAmount,
                                        InvestmentTerm = contract.InvestmentTerm,
                                        Status = contract.Status
                                    });
                                }

                                return contractsDTO;
                            }
                        }

                        return new List<ContractDTO>();
                    }

                    return new List<ContractDTO>();
                }
            }
            catch (Exception ex)
            {
                throw new ArgumentNullException(ex.Message, ex);
            }
        }
    }
}
