using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.API.DTOs;
using Todo.Entities.Intefaces;
using Todo.Entities.Models;

namespace Todo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController(IUnitOfWork unitOfWork, IMapper mapper) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var todos = await unitOfWork.Todo.GetAll();
            return Ok(todos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var todo = await unitOfWork.Todo.GetOne(e => e.Id == id);
            if (todo == null)
                return NotFound();
           
            return Ok(todo);
        }
        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTodoDTO todoDto)
        {
            if (ModelState.IsValid)
            {
                var todoItem = mapper.Map<TodoItem>(todoDto);
                await unitOfWork.Todo.Add(todoItem);
                await unitOfWork.Complete();
                return Ok(todoItem);
            }
            return BadRequest(ModelState);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTodoDTO todoDto)
        {
            if (id != todoDto.Id)
                return BadRequest("Id mismatch");

            if (ModelState.IsValid)
            {
                var existingTodo = await unitOfWork.Todo.GetOne(e => e.Id == id);
                if (existingTodo == null)
                    return NotFound();

                mapper.Map(todoDto, existingTodo);
                await unitOfWork.Complete();
                return NoContent();
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var todo = await unitOfWork.Todo.GetOne(e => e.Id == id);
            if (todo is null)
                return NotFound();

            await unitOfWork.Todo.Delete(todo);
            await unitOfWork.Complete();

            return NoContent();
        }
    }
}
