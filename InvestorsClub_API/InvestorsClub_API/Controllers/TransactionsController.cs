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
    public class TransactionsController : ControllerBase
    {
        private readonly IInvestmentRequestService _investmentRequestService;
        private readonly IContractService _contractService;

        public TransactionsController(
                IContractService contractService,
                IInvestmentRequestService investmentRequestService
            )
        {

            _contractService = contractService;
            _investmentRequestService = investmentRequestService;
        }

        [HttpPost]
        [Route("investmentReq")]
        public async Task<ActionResult<InvestmentRequestDTO>> GetInvestmentRequestById(int id)
        {
            try
            {
                var invReq = await _investmentRequestService.GetInvestmentRequestById(id);

                if (invReq != null)
                {
                    return Ok(invReq);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        [Route("createInvestmentReq")]
        public async Task<ActionResult<bool>> CreateInvestmentRequest(InvestmentRequests request)
        {
            bool isCreated = await _investmentRequestService.CreateInvestmentRequest(request);

            if (isCreated)
            {
                return Ok(isCreated);
            }

            return BadRequest("Failed to create investment request");
        }

        [HttpDelete]
        [Route("deleteInvestmentReq")]
        public async Task<ActionResult<DeletingResult>> DeleteInvestmentRequestById(int id)
        {
            try
            {
                DeletingResult deleteRes = await _investmentRequestService.DeleteInvestmentRequestById(id);

                if (DeletingResult.Success == deleteRes)
                {
                    return Ok(DeletingResult.Success);
                }

                return BadRequest(DeletingResult.ItemNotFound);
            }
            catch (Exception ex)
            {
                return StatusCode(500, DeletingResult.Failure.ToString());
            }
        }

        [HttpPost]
        [Route("investmentByEmail")]
        public async Task<ActionResult<IEnumerable<InvestmentRequestDTO>>> GetInvestmentRequestsByInvestorEmail(string email)
        {
            try
            {
                var invReqs = await _investmentRequestService.GetInvestmentRequestsByInvestorEmail(email);

                if (invReqs.Any())
                {
                    return Ok(invReqs);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        [Route("contract")]
        public async Task<ActionResult<ContractDTO>> GetContractById(int id)
        {
            try
            {
                var contract = await _contractService.GetContractById(id);

                if (contract != null)
                {
                    return Ok(contract);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        [Route("createContract")]
        public async Task<ActionResult<bool>> CreateContract(Contracts contract)
        {
            try
            {
                bool isCreated = await _contractService.CreateContract(contract);

                if (isCreated)
                {
                    return Ok(isCreated);
                }

                return BadRequest("Failed to create contract");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpDelete]
        [Route("deleteContract")]
        public async Task<ActionResult<DeletingResult>> DeleteContractById(int id)
        {
            try
            {
                DeletingResult deleteRes = await _contractService.DeleteContractById(id);

                if (DeletingResult.Success == deleteRes)
                {
                    return Ok(DeletingResult.Success);
                }

                return BadRequest(DeletingResult.ItemNotFound);
            }
            catch (Exception ex)
            {
                return StatusCode(500, DeletingResult.Failure.ToString());
            }
        }

        [HttpPut]
        [Route("updateContract")]
        public async Task<ActionResult<bool>> UpdateContractStatus(int id, Statuses status)
        {
            try
            {
                bool isUpdated = await _contractService.UpdateContractStatus(id, status);

                if (isUpdated)
                {
                    return Ok(isUpdated);
                }

                return BadRequest("Failed to update status");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        [Route("contractByEmail")]
        public async Task<ActionResult<IEnumerable<InvestmentRequestDTO>>> GetContractByEmail(string email)
        {
            try
            {
                var contracts = await _contractService.GetContractsByEmail(email);

                if (contracts.Any())
                {
                    return Ok(contracts);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
