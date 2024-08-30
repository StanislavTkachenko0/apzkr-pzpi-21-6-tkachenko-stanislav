using InvestorsClub_API.Attributes;

namespace InvestorsClub_API.Enums
{
    public enum DocumentTypes
    {
        [StringValue("Business Plan")]
        BusinessPlan,
        [StringValue("Presentation")]
        Presentation,
        [StringValue("Investment Agreement")]
        InvestmentAgreement,
        [StringValue("Financial Statements")]
        FinancialStatements,
        [StringValue("Legal Documents")]
        LegalDocuments,
        [StringValue("Technical Documentation")]
        TechnicalDocumentation,
        [StringValue("Marketing Materials")]
        MarketingMaterials,
        [StringValue("Personal Documents")]
        PersonalDocuments
    }
}
