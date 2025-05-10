using System.ComponentModel.DataAnnotations;
using Todo.Entities.Enums;

namespace Todo.API.DTOs
{
    public class CreateTodoDTO
    {
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TodoStatus Status { get; set; }
        public TodoPriority Priority { get; set; }
        public DateTime? DueDate { get; set; }
    }
}