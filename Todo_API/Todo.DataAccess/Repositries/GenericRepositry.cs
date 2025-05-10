using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Todo.DataAccess.Data;
using Todo.Entities.Intefaces;

namespace Todo.DataAccess.Repositries
{
    public class GenericRepositry<T> : IGenericRepositry<T> where T : class
    {
        private readonly TodoDbContext _context;
        private readonly DbSet<T> _dbSet;
        public GenericRepositry(TodoDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }
        public async Task Add(T item)
        {
           await _context.AddAsync(item);
        }

        public async Task Delete(T item)
        {
            await Task.Run(() => _dbSet.Remove(item));
        }

        public async Task<IEnumerable<T>> GetAll(Expression<Func<T, bool>>? filter = null)
        { 
            IQueryable<T> query = _dbSet;
            
            if (filter != null)
                query = query.Where(filter);
            
            return await query.ToListAsync();
        }

        public Task<T>? GetOne(Expression<Func<T, bool>> filter)
        {
            return _dbSet.FirstOrDefaultAsync(filter) ?? null;
        }

        public async Task Update(T entity)
        {
            await Task.Run(() => _dbSet.Update(entity));
        }
    }
}
