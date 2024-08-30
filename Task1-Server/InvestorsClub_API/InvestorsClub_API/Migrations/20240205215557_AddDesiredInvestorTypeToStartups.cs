using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvestorsClub_API.Migrations
{
    public partial class AddDesiredInvestorTypeToStartups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DesiredInvestorType",
                table: "Startups",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DesiredInvestorType",
                table: "Startups");
        }
    }
}
