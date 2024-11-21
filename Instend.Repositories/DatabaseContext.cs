using Instend.Core.Models.Access;
using Instend.Core.Models.Account;
using Instend.Core.Models.Formats;
using Instend.Core.Models.Links;
using Instend.Core.Models.Messages;
using Instend.Core.Models.Messenger;
using Instend.Core.Models.Public;
using Instend.Core.Models.Storage;
using Instend.Core.TransferModels.Messenger;
using Instend.Core.Models.Email;
using Microsoft.EntityFrameworkCore;
using static Instend.Core.Models.Links.AlbumLinks;

namespace Instend.Core
{
    public class DatabaseContext : DbContext
    {
        public DbSet<AccountModel> Accounts { get; set; } = null!;
        public DbSet<ConfirmationModel> Confirmations { get; set; } = null!;
        public DbSet<SessionModel> Sessions { get; set; } = null!;
        public DbSet<FolderModel> Folders { get; set; } = null!;
        public DbSet<FileModel> Files { get; set; } = null!;
        public DbSet<AlbumModel> Albums { get; set; } = null!;
        public DbSet<AlbumAccess> AlbumAccess { get; set; } = null!;
        public DbSet<AlbumLink> AlbumLinks { get; set; } = null!;
        public DbSet<FolderAccess> FolderAccesses { get; set; } = null!;
        public DbSet<Models.Access.FileAccess> FileAccess { get; set; } = null!;
        public DbSet<PublicationModel> Publications { get; set; } = null!;
        public DbSet<AlbumCommentLink> AlbumCommentLinks { get; set; } = null!;
        public DbSet<MessageModel> Messages { get; set; } = null!;
        public DbSet<DirectMessageLink> DirectLinks { get; set; } = null!;
        public DbSet<UserPublicationLink> UserPublications { get; set; } = null!;
        public DbSet<FriendModel> Friends { get; set; } = null!;
        public DbSet<DirectModel> Directs { get; set; } = null!;
        public DbSet<GroupModel> Groups { get; set; } = null!;
        public DbSet<GroupMemberLink> GroupMemberLink { get; set; } = null!;
        public DbSet<AttachmentModel> Attachments { get; set; } = null!;
        public DbSet<GroupMessageLink> GroupMessageLink { get; set; } = null!;
        public DbSet<AttachmentCommentLink> CommentAttachments { get; set; } = null!;
        public DbSet<MessageAttachmentLink> MessageAttachmentLinks { get; set; } = null!;
        public DbSet<FolderMessageLink> FolderMessageLink { get; set; } = null!;
        public DbSet<FileMessageLink> FileMessageModel { get; set; } = null!;
        public DbSet<PublictionLikeLink> PublicationLikeLinks { get; set; } = null!;
        public DbSet<SongFormat> SongsMeta { get; set; } = null!;

        public DatabaseContext() => Database.EnsureCreated();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(
                "server=localhost;user=root;password=47188475;database=async_storage",
                new MySqlServerVersion(new Version(8, 3, 0)),
                mySqlOptions => mySqlOptions.EnableRetryOnFailure()
            );
        }
    }
}