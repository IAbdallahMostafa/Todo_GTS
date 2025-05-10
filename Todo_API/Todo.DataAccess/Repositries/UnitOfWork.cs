using Todo.DataAccess.Data;
using Todo.Entities.Intefaces;

namespace Todo.DataAccess.Repositries
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly TodoDbContext _context;
        public ITodoRepositry Todo { get; private set; } = null!;

        public UnitOfWork(TodoDbContext context)
        {
            _context = context;
            Todo = new TodoRepositry(context);
        }
        public async Task<int> Complete()
        {
           return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
           _context.Dispose();
        }

    }
}
