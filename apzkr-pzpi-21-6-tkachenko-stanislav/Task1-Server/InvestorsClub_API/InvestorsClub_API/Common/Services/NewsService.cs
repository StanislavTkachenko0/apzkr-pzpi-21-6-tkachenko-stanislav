using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.DBContext;
using InvestorsClub_API.Enums;
using InvestorsClub_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvestorsClub_API.Common.Services
{
    public class NewsService : INewsService
    {
        private readonly InvestorsClubContext _context;

        public NewsService(InvestorsClubContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateNews(News newNews)
        {
            _context.News.Add(newNews);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<News>> GetNews()
        {
            var news = await _context.News.ToListAsync();

            return news;
        }

        public async Task<DeletingResult> DeleteNews(int id)
        {

            var post = await _context.News.FindAsync(id);
            if (post == null)
                return DeletingResult.ItemNotFound;

            _context.News.Remove(post);
            await _context.SaveChangesAsync();

            return DeletingResult.Success;
        }
    }
}
