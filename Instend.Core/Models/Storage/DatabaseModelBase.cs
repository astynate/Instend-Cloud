namespace Instend.Repositories.Storage
{
    public class DatabaseModelBase
    {
        public Guid Id { get; protected set; } = Guid.NewGuid(); 
    }
}