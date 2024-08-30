using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InvestorsClub_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet]
        [Route("news")]
        public async Task<IEnumerable<News>> GetNews()
        {
            var news = await _newsService.GetNews();

            return news;
        }

        [HttpPost]
        [Route("news")]
        public async Task<ActionResult<bool>> AddNews(News news)
        {
            var res = await _newsService.CreateNews(news);

            return Ok(res);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<DeletingResult>> DeleteNews(int id)
        {
            var delResult = await _newsService.DeleteNews(id);

            return Ok(delResult);
        }
    }
}
