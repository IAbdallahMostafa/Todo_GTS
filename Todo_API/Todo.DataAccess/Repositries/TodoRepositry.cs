
using Todo.DataAccess.Data;
using Todo.Entities.Intefaces;
using Todo.Entities.Models;

namespace Todo.DataAccess.Repositries
{
    public class TodoRepositry : GenericRepositry<TodoItem>, ITodoRepositry
    {
        public TodoRepositry(TodoDbContext context) : base(context)
        {
        }
    }
}
