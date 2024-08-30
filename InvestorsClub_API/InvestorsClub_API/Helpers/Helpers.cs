using InvestorsClub_API.Attributes;

namespace InvestorsClub_API.Helpers
{
    public static class Helpers
    {

        static string GetEnumStringValue(Enum value)
        {
            var stringValueAttribute = value.GetType()
                .GetField(value.ToString())
                .GetCustomAttributes(typeof(StringValueAttribute), false)
                .SingleOrDefault() as StringValueAttribute;

            return stringValueAttribute?.Value ?? value.ToString();
        }
    }
}
