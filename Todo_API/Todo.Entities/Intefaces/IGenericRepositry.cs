using System.Linq.Expressions;

namespace Todo.Entities.Intefaces
{
    public interface IGenericRepositry<T> where T : class
    {
        Task<IEnumerable<T>> GetAll(Expression<Func<T, bool>>? filter = null);
        Task<T>? GetOne(Expression<Func<T, bool>> filter = null);
        Task Add(T item);
        Task Update(T item);
        Task Delete(T item);
    }
}
