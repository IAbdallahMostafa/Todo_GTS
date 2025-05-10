namespace Todo.Entities.Intefaces
{
    public interface IUnitOfWork : IDisposable
    {
        ITodoRepositry Todo { get; }
        Task<int> Complete();

    }
}
