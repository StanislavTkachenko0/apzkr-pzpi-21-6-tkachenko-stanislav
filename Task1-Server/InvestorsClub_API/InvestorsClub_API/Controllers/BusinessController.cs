using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DTO;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvestorsClub_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly IStartupsService _startupsService;
        private readonly IReviewsService _reviewsService;

        public BusinessController(
            IStartupsService startupsService,
            IReviewsService reviewsService
            ) 
        { 
            _startupsService = startupsService;
            _reviewsService = reviewsService;
        }

        [HttpPost]
        [Route("")]
        public async Task<IEnumerable<StartupDTO>> GetStartups(string email)
        {
            var startups = await _startupsService.GetStartups(email);

            return startups;
        }

        [HttpPost]
        [Route("GetByFounder")]
        public async Task<IEnumerable<StartupDTO>> GetStartupsByFounder(int id)
        {
            var startups = await _startupsService.GetStartupsByFounder(id);

            return startups;
        }

        [HttpDelete]
        [Route("DeleteBusiness")]
        public async Task<ActionResult<DeletingResult>> DeleteStartup(int startupId)
        {
            var result = await _startupsService.DeleteStartupById(startupId);

            return result;
        }

        [HttpPut]
        [Route("EditBusiness")]
        public async Task<ActionResult> EditStartup([FromBody] StartupDTO startup)
        {
            var result = await _startupsService.EditStartup(startup);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<bool>> CreateStartup(Startups startup)
        {
            try
            {
                var result = await _startupsService.CreateStartup(startup);

                if (result)
                {
                    return Ok(true);
                }
                else
                {
                    return BadRequest("Failed to create startup");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        [Route("AddReview")]
        public async Task<ActionResult<bool>> AddReview(Reviews review)
        {
            try
            {
                bool isCreated = await _reviewsService.AddReview(review);

                if (isCreated)
                {
                    return Ok(isCreated);
                }

                return BadRequest("Failed to create review");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        [Route("Review")]
        public async Task<ActionResult<IQueryable<ReviewDTO>>> GetReviews(int startupId)
        {
            try
            {
                var reviews = await _reviewsService.GetReviewsByStartupId(startupId);


                if (reviews.Any())
                {
                    return Ok(reviews);
                }

                return Ok(new List<ReviewDTO>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost]
        [Route("ReviewAverage")]
        public async Task<ActionResult<int>> GetReviewsAverage(int startupId)
        {
            try
            {
                var reviewsAverage = await _reviewsService.GetAverageOfReviewsByStartupId(startupId);

                return Ok(reviewsAverage);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
