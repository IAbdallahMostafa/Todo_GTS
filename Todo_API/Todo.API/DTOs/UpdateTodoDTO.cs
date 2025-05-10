namespace Todo.API.DTOs
{
    public class UpdateTodoDTO : CreateTodoDTO
    {
        public Guid Id { get; set; }
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
    }
}