using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace InvestorsClub_API.Common.Interfaces
{
    public interface INewsService
    {
        public Task<IEnumerable<News>> GetNews();

        public Task<bool> CreateNews(News newNews);

        public Task<DeletingResult> DeleteNews(int id);
    }
}
