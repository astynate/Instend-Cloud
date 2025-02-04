using Instend.Core.Models.Messenger.Direct;
using Instend.Core.Models.Messenger.Group;
using Instend.Core.Models.Messenger.Message;
using Microsoft.EntityFrameworkCore;

namespace Instend.Repositories.Contexts
{
    public abstract class MessagesContext : AccountsContext
    {
        public DbSet<Direct> Directs { get; set; } = null!;
        public DbSet<Group> Groups { get; set; } = null!;
        public DbSet<GroupMember> GroupMembers { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<MessageAttachment> MessagesAttachments { get; set; } = null!;
        public DbSet<MessageFile> MessageFiles { get; set; } = null!;
        public DbSet<MessageCollection> MessagesCollections { get; set; } = null!;
        public DbSet<DirectMessage> DirectMessages { get; set; } = null!;
        public DbSet<GroupMessage> GroupMessages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<Message>()
                .HasMany(m => m.Attachments)
                .WithMany()
                .UsingEntity<MessageAttachment>();

            modelBuilder
                .Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(x => x.AccountId);

            modelBuilder
                .Entity<Direct>()
                .HasMany(m => m.Messages)
                .WithMany()
                .UsingEntity<DirectMessage>();

            modelBuilder
                .Entity<Direct>()
                .HasOne(m => m.Account)
                .WithMany()
                .HasForeignKey(x => x.AccountId);

            modelBuilder
                .Entity<Direct>()
                .HasOne(m => m.Owner)
                .WithMany()
                .HasForeignKey(x => x.OwnerId);

            modelBuilder
                .Entity<Group>()
                .HasMany(m => m.Messages)
                .WithMany()
                .UsingEntity<GroupMessage>();

            modelBuilder
                .Entity<Group>()
                .HasMany(m => m.Members)
                .WithOne(gm => gm.Group);
        }
    }
}