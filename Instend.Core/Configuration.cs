using CSharpFunctionalExtensions;
using Instend.Core.Models.Storage;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Instend.Core
{
    public static class Configuration
    {
        static Configuration()
        {
            DefaultAvatar = Convert.ToBase64String(File.ReadAllBytes(DefaultAvatarPath));
            DefaultAlbumCover = Convert.ToBase64String(File.ReadAllBytes(DefaultAlbumCoverPath));
        }

        public const string Issuer = "Instend NPO";

        public const string Audience = "User";

        public static readonly string TestEncryptionKey = "bbosbfsn-fsd6fds-f8sd6fs-d6f87s6f-8sd6f8s6f-8s6f";

        public static readonly string CorporateEmail = "zixe.company@gmail.com";

        public static readonly string CorporatePassword = "kqzu gsig ghgn ecis";

        public static readonly string DefaultAvatarPath = "D:/Instend LLC/System/default-avatar.png";

        public static readonly string DefaultAlbumCoverPath = "D:/Instend LLC/System/default-album-cover.png";

        public static readonly string URL = "http://localhost:44441/";

        public static readonly int confirmationLifeTimeInHours = 3;

        public static readonly int refreshTokenLifeTimeInDays = 30;

        public static readonly int accessTokenLifeTimeInMinutes = 30;

        public static readonly string? DefaultAvatar;

        public static readonly string DefaultAlbumCover;

        public static readonly string[] imageTypes = {"png", "jpg", "jpeg", "gif"};

        public static readonly string[] musicTypes = {"mp3", "m4a", "wav"};

        public static readonly string[] videoTypes = {"mp4", "mov", "mpeg-4"};

        public static readonly string[] documentTypes = {"doc", "docx"};

        public static readonly string[] systemFolders = { "Music", "Photos", "Trash" };

        public static readonly string[] postAvailableTypes = imageTypes.Concat(videoTypes).ToArray();

        public delegate Task<byte[]> HandleFileCover((string type, string path) parameters);

        public delegate string ConvertToHtml(string path);

        public delegate Task<Result<AttachmentModel>> GetAttachmentDelegate(Guid itemId, Guid attachmentId);

        public static readonly string[] _drivePaths = { "D:/Instend LLC/System/" };

        public static string GetAvailableDrivePath()
        {
            var maxFreeSpacePath = "D:/";
            long maxFreeSpace = 0;

            foreach (var path in _drivePaths)
            {
                DriveInfo driveInfo = new DriveInfo(Path.GetPathRoot(path) ?? "");
                
                if (driveInfo.IsReady)
                {
                    var freeSpace = driveInfo.AvailableFreeSpace;

                    if (freeSpace > maxFreeSpace)
                    {
                        maxFreeSpace = freeSpace;
                        maxFreeSpacePath = path;
                    }
                }
            }

            return maxFreeSpacePath;
        }

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