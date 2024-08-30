using InvestorsClub_API.Common.Interfaces;
using InvestorsClub_API.Common.Services;
using InvestorsClub_API.DBContext;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<InvestorsClubContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("default")));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IHashService, HashService>();
builder.Services.AddScoped<INewsService, NewsService>();
builder.Services.AddScoped<IStartupsService, StartupsService>();
builder.Services.AddScoped<IInvestorsService, InvestorsService>();
builder.Services.AddScoped<IReviewsService, ReviewsService>();
builder.Services.AddScoped<IRecomendationService, RecomendationService>();
builder.Services.AddScoped<IInvestmentRequestService, InvestmentRequestService>();
builder.Services.AddScoped<IContractService, ContractService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseStaticFiles();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();
