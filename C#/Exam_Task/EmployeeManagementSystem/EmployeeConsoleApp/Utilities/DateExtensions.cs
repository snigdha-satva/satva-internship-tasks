namespace EmployeeConsoleApp.Utilities
{
    internal static class DateExtensions
    {
        internal static string ToFormattedDateString(this DateTime date)
        {
            return date.ToString("dd-MMM-yyyy");
        }

        internal static int CalculateYearsFromToday(this DateTime startDate)
        {
            var today = DateTime.Today;
            int years = today.Year - startDate.Year;

            if (startDate.Date > today.AddYears(-years))
            {
                years--;
            }

            return Math.Max(years, 0);
        }

        internal static string CalculateExperienceFromToday(this DateTime startDate)
        {
            (int years, int months) = CalculateYearsAndMonths(startDate.Date, DateTime.Today);

            if (years <= 0)
            {
                return $"{months} {(months == 1 ? "month" : "months")}";
            }

            if (months <= 0)
            {
                return $"{years} {(years == 1 ? "year" : "years")}";
            }

            return $"{years} {(years == 1 ? "year" : "years")} {months} {(months == 1 ? "month" : "months")}";
        }

        private static (int Years, int Months) CalculateYearsAndMonths(DateTime startDate, DateTime endDate)
        {
            if (endDate <= startDate)
            {
                return (0, 0);
            }

            int totalMonths = (endDate.Year - startDate.Year) * 12 + (endDate.Month - startDate.Month);

            if (endDate.Day < startDate.Day)
            {
                totalMonths--;
            }

            totalMonths = Math.Max(totalMonths, 0);

            int years = totalMonths / 12;
            int months = totalMonths % 12;

            return (years, months);
        }
    }
}
