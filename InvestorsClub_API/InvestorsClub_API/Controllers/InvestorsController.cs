using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvestorsClub_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvestorsController : ControllerBase
    {
        private readonly IInvestorsService _investorsService;

        public InvestorsController(IInvestorsService investorsService)
        {
            _investorsService = investorsService;
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<bool>> AddInvestor(Investors investor)
        {
            try
            {
                bool isCreate = await _investorsService.AddInvestorAsync(investor);

                if (isCreate)
                {
                    return Ok(isCreate);
                }

                return BadRequest("Failed to create investor");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet]
        [Route("Investor")]
        public async Task<ActionResult<InvestorDTO>> GetInvestorByEmail(string email)
        {
            try
            {
                var investor = await _investorsService.GetInvestorByEmailAsync(email);

                if (investor != null)
                {
                    return Ok(investor);
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
