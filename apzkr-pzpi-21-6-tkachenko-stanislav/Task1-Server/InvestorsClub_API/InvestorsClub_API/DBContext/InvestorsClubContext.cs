using InvestorsClub_API.Models;
using Microsoft.EntityFrameworkCore;

namespace InvestorsClub_API.DBContext
{
    public class InvestorsClubContext : DbContext
    {
        public InvestorsClubContext()
        {
        }

        public InvestorsClubContext(DbContextOptions<InvestorsClubContext> options) 
            : base(options)
        { 
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Startups> Startups { get; set; }
        public DbSet<Investors> Investors { get; set; }
        public DbSet<InvestmentRequests> InvestmentRequests { get; set; }
        public DbSet<Reviews> Reviews { get; set; }
        public DbSet<Events> Events { get; set; }
        public DbSet<Contracts> Contracts { get; set; }
        public DbSet<News> News { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("server=DESKTOP-LUHM5EQ;Database=InvestorsClub;Trusted_Connection=True;TrustServerCertificate=true;");
            }
        }
    }
}
