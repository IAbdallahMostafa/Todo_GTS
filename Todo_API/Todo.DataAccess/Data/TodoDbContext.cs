using Microsoft.EntityFrameworkCore;
using Todo.Entities.Models;

namespace Todo.DataAccess.Data
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
        {
        }
        public DbSet<TodoItem> TodoItems { get; set; } = null!;
    }
}
