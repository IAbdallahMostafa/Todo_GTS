using AutoMapper;
using Todo.API.DTOs;
using Todo.Entities.Models;

namespace Todo.API.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<TodoItem, CreateTodoDTO>()
                .ReverseMap();

            CreateMap<TodoItem, UpdateTodoDTO>()
                .ReverseMap();

        }
    }
}
