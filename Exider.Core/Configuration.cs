using Exider.Services.External.FileService;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Exider.Core
{
    public static class Configuration
    {
        static Configuration()
        {
            try
            {
                DefaultAvatar = Convert.ToBase64String(File.ReadAllBytes(DefaultAvatarPath));
            }
            catch (Exception exception) 
            {
                Console.WriteLine(exception);
            }
        }

        public const string Issuer = "Exider Company";

        public const string Audience = "User";

        public static readonly string TestEncryptionKey = "bbosbfsn-fsd6fds-f8sd6fs-d6f87s6f-8sd6f8s6f-8s6f";

        public static readonly string CorporateEmail = "zixe.company@gmail.com";

        public static readonly string CorporatePassword = "svgb zokl oqjy jzup";

        public static readonly string DefaultAvatarPath = "D:/Exider-System/default-avatar.png";

        public static readonly string URL = "http://localhost:44441/";

        public static readonly int confirmationLifeTimeInHours = 3;

        public static readonly int refreshTokenLifeTimeInDays = 30;

        public static readonly int accsessTokenLifeTimeInMinutes = 30;

        public static readonly string? DefaultAvatar;

        public static readonly string SystemDrive = "D:/Exider-System/";

        public static readonly string[] imageTypes = {"png", "jpg", "jpeg", "gif"};

        public static readonly string[] documentTypes = {"doc", "docx"};

        public delegate Task HandleFileCover(IFileService fileService);

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

        public static SymmetricSecurityKey GetSecurityKey()
            => new(Encoding.UTF8.GetBytes(TestEncryptionKey));
    }
}
