using Instend.Core.Models.Messenger.Direct;
using Instend.Core.Models.Messenger.Group;
using Instend.Core.Models.Messenger.Message;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public class MessagesContext : DatabaseContextBase
    {
        public DbSet<Direct> Directs { get; set; } = null!;
        public DbSet<Group> Groups { get; set; } = null!;
        public DbSet<GroupMember> GroupMembers { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<MessageAttachment> MessageAttachments { get; set; } = null!;
        public DbSet<MessageFile> MessageFiles { get; set; } = null!;
        public DbSet<MessageCollection> MessageFolders { get; set; } = null!;
        public DbSet<DirectMessage> DirectMessages { get; set; } = null!;
        public DbSet<GroupMessage> GroupMessages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<Message>()
                .HasMany(m => m.Files)
                .WithMany()
                .UsingEntity<MessageFile>();

            modelBuilder
                .Entity<Message>()
                .HasMany(m => m.Folders)
                .WithMany()
                .UsingEntity<MessageCollection>();

            modelBuilder
                .Entity<Message>()
                .HasMany(m => m.Attachments)
                .WithMany()
                .UsingEntity<MessageAttachment>();

            modelBuilder
                .Entity<Direct>()
                .HasMany(m => m.Messages)
                .WithMany()
                .UsingEntity<DirectMessage>();

            modelBuilder
                .Entity<Group>()
                .HasMany(m => m.Messages)
                .WithMany()
                .UsingEntity<GroupMessage>();

            modelBuilder
                .Entity<Group>()
                .HasMany(m => m.Members)
                .WithMany()
                .UsingEntity<GroupMember>();
        }
    }
}