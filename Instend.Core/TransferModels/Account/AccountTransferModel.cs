namespace Instend.Core.TransferModels.Account
{
    public record class AccountTransferModel
    {
        public Guid Id { get; set; }
        public string? Name { get; init; }
        public string? Surname { get; init; }
        public string? Nickname { get; init; }
        public string? Email { get; init; }
        public string? Avatar { get; set; }
        public string? Header { get; set; }
        public string? Description { get; init; }
        public double StorageSpace { get; init; }
        public double OccupiedSpace { get; init; }
        public decimal Balance { get; init; }
        public uint FriendCount { get; init; }
    }
}