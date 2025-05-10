using System.ComponentModel.DataAnnotations;
using Todo.Entities.Enums;

namespace Todo.Entities.Models
{
    public class TodoItem
    {
        public Guid Id { get; set; }
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TodoStatus Status { get; set; } 
        public TodoPriority Priority { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastModifiedDate { get; set; } = null!; 
    }
}
