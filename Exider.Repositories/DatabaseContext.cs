using Exider.Core.Models.Access;
using Exider.Core.Models.Account;
using Exider.Core.Models.Albums;
using Exider.Core.Models.Comments;
using Exider.Core.Models.Email;
using Exider.Core.Models.Formats;
using Exider.Core.Models.Links;
using Exider.Core.Models.Messages;
using Exider.Core.Models.Messenger;
using Exider.Core.Models.Public;
using Exider.Core.Models.Storage;
using Microsoft.EntityFrameworkCore;
using static Exider.Core.Models.Links.AlbumLinks;

namespace Exider.Core
{
    public class DatabaseContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; } = null!;
        public DbSet<EmailModel> Email { get; set; } = null!;
        public DbSet<SessionModel> Sessions { get; set; } = null!;
        public DbSet<ConfirmationModel> Confirmation { get; set; } = null!;
        public DbSet<UserDataModel> UserData { get; set; } = null!;
        public DbSet<FolderModel> Folders { get; set; } = null!;
        public DbSet<FileModel> Files { get; set; } = null!;
        public DbSet<AlbumModel> Albums { get; set; } = null!;
        public DbSet<AlbumAccess> AlbumAccess { get; set; } = null!;
        public DbSet<AlbumLink> AlbumLinks { get; set; } = null!;
        public DbSet<FolderAccess> FolderAccesses { get; set; } = null!;
        public DbSet<Models.Access.FileAccess> FileAccess { get; set; } = null!;
        public DbSet<CommentModel> Comments { get; set; } = null!;
        public DbSet<AlbumCommentLink> AlbumCommentLinks { get; set; } = null!;
        public DbSet<ComminityPublicationLink> ComminityPublicationLinks { get; set; } = null!;
        public DbSet<CommunityFollowerLink> CommunityFollowers { get; set; } = null!;
        public DbSet<MessageModel> Messages { get; set; } = null!;
        public DbSet<DirectMessageLink> DirectLinks { get; set; } = null!;
        public DbSet<CommunityModel> Communities { get; set; } = null!;
        public DbSet<UserPublicationLink> UserPublications { get; set; } = null!;
        public DbSet<FriendModel> Friends { get; set; } = null!;
        public DbSet<DirectModel> Directs { get; set; } = null!;
        public DbSet<GroupModel> Groups { get; set; } = null!;
        public DbSet<GroupMemberLink> GroupMemberLink { get; set; } = null!;
        public DbSet<AttachmentModel> Attachments { get; set; } = null!;
        public DbSet<AttachmentCommentLink> CommentAttachments { get; set; } = null!;
        public DbSet<AlbumViewLink> ViewsLinks { get; set; } = null!;
        public DbSet<MessageAttachmentLink> MessageAttachmentLinks { get; set; } = null!;
        public DbSet<PublictionLikeLink> PublictionLikeLinks { get; set; } = null!;
        public DbSet<SongFormat> SongsMeta { get; set; } = null!;

        public DatabaseContext() => Database.EnsureCreated();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql("server=localhost;user=root;password=47188475;database=async_storage",
                new MySqlServerVersion(new Version(8, 3, 0)),
                mySqlOptions => mySqlOptions.EnableRetryOnFailure());
        }
    }
}