using CSharpFunctionalExtensions;
using Exider.Core.Models.Storage;
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
                DefaultAlbumCover = Convert.ToBase64String(File.ReadAllBytes(DefaultAlbumCoverPath));
            }
            catch (Exception exception) 
            {
                Console.WriteLine(exception);
            }
        }

        public const string Issuer = "Yexider Company";

        public const string Audience = "User";

        public static readonly string TestEncryptionKey = "bbosbfsn-fsd6fds-f8sd6fs-d6f87s6f-8sd6f8s6f-8s6f";

        public static readonly string CorporateEmail = "zixe.company@gmail.com";

        public static readonly string CorporatePassword = "kqzu gsig ghgn ecis";

        public static readonly string DefaultAvatarPath = "D:/Exider-System/default-avatar.png";

        public static readonly string DefaultAlbumCoverPath = "D:/Exider-System/default-album-cover.png";

        public static readonly string URL = "http://localhost:44441/";

        public static readonly int confirmationLifeTimeInHours = 3;

        public static readonly int refreshTokenLifeTimeInDays = 30;

        public static readonly int accsessTokenLifeTimeInMinutes = 30;

        public static readonly string? DefaultAvatar;

        public static readonly string DefaultAlbumCover;

        public static readonly string SystemDrive = "D:/Exider-System/";

        public static readonly string[] imageTypes = {"png", "jpg", "jpeg", "gif"};

        public static readonly string[] musicTypes = {"mp3", "m4a", "wav"};

        public static readonly string[] videoTypes = {"mp4", "mov", "mpeg-4"};

        public static readonly string[] documentTypes = {"doc", "docx"};

        public static readonly string[] systemFolders = { "Music", "Photos", "Trash" };

        public static readonly string[] postAvailableTypes = imageTypes.Concat(videoTypes).ToArray();

        public delegate Task<byte[]> HandleFileCover((string type, string path) parameters);

        public delegate string ConvertToHtml(string path);

        public delegate Task<Result<AttachmentModel>> GetAttachmentDelegate(Guid itemId, Guid attachmentId);

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

        public enum AccessTypes
        {
            Private,
            Favorites,
            Public,
        }

        public enum FolderTypes
        {
            Ordinary,
            System,
            Secret
        }

        public enum Abilities
        {
            Read,
            Write
        }

        public enum AlbumTypes
        {
            Album,
            Playlist
        }

        public static SymmetricSecurityKey GetSecurityKey()
            => new(Encoding.UTF8.GetBytes(TestEncryptionKey));
    }
}