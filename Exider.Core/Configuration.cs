namespace Exider.Core
{
    public static class Configuration
    {

        public static readonly string testEncryptionKey = "bbosbfsn-fsd6fds-f8sd6fs-d6f87s6f-8sd6f8s6f-8s6f";

        public static readonly string corporateEmail = "zixe.company@gmail.com";

        public static readonly string corporatePassword = "svgb zokl oqjy jzup";

        public static readonly string URL = "http://localhost:44441/";

        public static readonly int confirmationLifeTimeInHours = 3;

        public static readonly int refreshTokenLifeTimeInDays = 30;

        public static readonly int accsessTokenLifeTimeInMinutes = 30;

        public enum Months
        {
            January = 1,
            February,
            March,
            April,
            May,
            June,
            July,
            August,
            September,
            October,
            November,
            December
        }

    }

}
