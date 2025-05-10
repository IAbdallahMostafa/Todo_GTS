
 const API_BASE_URL = 'https://localhost:7161/api/Todo';
 
 // Todo Status and Priority Enums
 const TodoStatus = {
     0: 'To Do',
     1: 'In Progress',
     2: 'Done'
 };
 
 const TodoPriority = {
     0: 'Low',
     1: 'Medium',
     2: 'High'
 };
 
 const StatusClass = {
     0: 'status-todo',
     1: 'status-inprogress',
     2: 'status-done'
 };
 
 const PriorityClass = {
     0: 'priority-low',
     1: 'priority-medium',
     2: 'priority-high'
 };
 
 // Create toast instances
 const successToast = new bootstrap.Toast(document.getElementById('successToast'));
 const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
 
 // Current filter states
 let currentStatusFilter = 'all';
 let currentPriorityFilter = 'all';
 let currentSearchTerm = '';
 
 // Load todos when the page loads
 document.addEventListener('DOMContentLoaded', () => {
     loadTodos();
     
     // Event listeners
     document.getElementById('refreshBtn').addEventListener('click', loadTodos);
     document.getElementById('saveTodoBtn').addEventListener('click', createTodo);
     document.getElementById('updateTodoBtn').addEventListener('click', updateTodo);
     document.getElementById('confirmDeleteBtn').addEventListener('click', deleteTodo);
     document.getElementById('searchInput').addEventListener('input', filterTodos);
     
     // Status filter event listeners
     document.querySelectorAll('.filter-status').forEach(item => {
         item.addEventListener('click', (e) => {
             e.preventDefault();
             currentStatusFilter = e.target.dataset.status;
             filterTodos();
         });
     });
     
     // Priority filter event listeners
     document.querySelectorAll('.filter-priority').forEach(item => {
         item.addEventListener('click', (e) => {
             e.preventDefault();
             currentPriorityFilter = e.target.dataset.priority;
             filterTodos();
         });
     });
 });
 
 // Load all todos from the API
 async function loadTodos() {
     try {
         const response = await fetch(API_BASE_URL);
         if (!response.ok) {
             throw new Error('Failed to load todos');
         }
         
         const todos = await response.json();
         renderTodos(todos);
         filterTodos();
         
     } catch (error) {
         showError(error.message);
     }
 }
 
 // Render todos in the container
 function renderTodos(todos) {
     const container = document.getElementById('todoContainer');
     container.innerHTML = '';
     
     if (todos.length === 0) {
         document.getElementById('noTodosMessage').classList.remove('d-none');
         return;
     }
     
     document.getElementById('noTodosMessage').classList.add('d-none');
     
     todos.forEach(todo => {
         const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
         const formattedDueDate = dueDate ? dueDate.toLocaleString() : 'No due date';
         
         const isOverdue = dueDate && dueDate < new Date() && todo.status !== 2;
         
         const card = document.createElement('div');
         card.className = `col-md-6 col-lg-4 mb-4 todo-item-container`;
         card.dataset.status = todo.status;
         card.dataset.priority = todo.priority;
         card.dataset.title = todo.title.toLowerCase();
         card.dataset.description = todo.description ? todo.description.toLowerCase() : '';
         
         card.innerHTML = `
             <div class="card h-100 todo-item ${PriorityClass[todo.priority]} ${StatusClass[todo.status]}">
                 <div class="card-header d-flex justify-content-between align-items-center">
                     <span class="badge ${getPriorityBadgeClass(todo.priority)}">${TodoPriority[todo.priority]}</span>
                     <span class="badge ${getStatusBadgeClass(todo.status)}">${TodoStatus[todo.status]}</span>
                 </div>
                 <div class="card-body">
                     <h5 class="card-title">${todo.title}</h5>
                     <p class="card-text">${todo.description || 'No description'}</p>
                     <p class="card-text ${isOverdue ? 'text-danger' : 'text-muted'}">
                         <small>
                             <i class="bi ${isOverdue ? 'bi-alarm-fill' : 'bi-calendar'}"></i> 
                             ${isOverdue ? 'OVERDUE: ' : ''}${formattedDueDate}
                         </small>
                     </p>
                 </div>
                 <div class="card-footer bg-transparent d-flex justify-content-between">
                     <button class="btn btn-sm btn-outline-warning edit-btn" data-id="${todo.id}">
                         <i class="bi bi-pencil-square"></i> Edit
                     </button>
                     <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${todo.id}">
                         <i class="bi bi-trash"></i> Delete
                     </button>
                 </div>
             </div>
         `;
         
         container.appendChild(card);
     });
     
     // Add event listeners to edit and delete buttons
     document.querySelectorAll('.edit-btn').forEach(btn => {
         btn.addEventListener('click', (e) => {
             const id = e.target.closest('.edit-btn').dataset.id;
             getTodoForEdit(id);
         });
     });
     
     document.querySelectorAll('.delete-btn').forEach(btn => {
         btn.addEventListener('click', (e) => {
             const id = e.target.closest('.delete-btn').dataset.id;
             document.getElementById('deleteId').value = id;
             const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
             confirmationModal.show();
         });
     });
 }
 
 // Filter todos based on status, priority and search term
 function filterTodos() {
     const searchTerm = document.getElementById('searchInput').value.toLowerCase();
     currentSearchTerm = searchTerm;
     
     const todoItems = document.querySelectorAll('.todo-item-container');
     let visibleCount = 0;
     
     todoItems.forEach(item => {
         const title = item.dataset.title;
         const description = item.dataset.description;
         const status = item.dataset.status;
         const priority = item.dataset.priority;
         
         const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
         const matchesStatus = currentStatusFilter === 'all' || status === currentStatusFilter;
         const matchesPriority = currentPriorityFilter === 'all' || priority === currentPriorityFilter;
         
         if (matchesSearch && matchesStatus && matchesPriority) {
             item.classList.remove('d-none');
             visibleCount++;
         } else {
             item.classList.add('d-none');
         }
     });
     
     if (visibleCount === 0) {
         document.getElementById('noTodosMessage').classList.remove('d-none');
     } else {
         document.getElementById('noTodosMessage').classList.add('d-none');
     }
 }
 
 // Create a new todo
 async function createTodo() {
     try {
         const title = document.getElementById('title').value;
         const description = document.getElementById('description').value;
         const status = parseInt(document.getElementById('status').value);
         const priority = parseInt(document.getElementById('priority').value);
         const dueDate = document.getElementById('dueDate').value;
         
         if (!title.trim()) {
             throw new Error('Title is required');
         }
         
         const todoData = {
             title: title,
             description: description,
             status: status,
             priority: priority,
             dueDate: dueDate || null
         };
         
         const response = await fetch(API_BASE_URL, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(todoData)
         });
         
         if (!response.ok) {
             throw new Error('Failed to create todo');
         }
         
         const modal = bootstrap.Modal.getInstance(document.getElementById('addTodoModal'));
         modal.hide();
         
         document.getElementById('addTodoForm').reset();
         showSuccess('Todo created successfully');
         loadTodos();
         
     } catch (error) {
         showError(error.message);
     }
 }
 
 // Get todo for editing
 async function getTodoForEdit(id) {
     try {
         const response = await fetch(`${API_BASE_URL}/${id}`);
         if (!response.ok) {
             throw new Error('Failed to load todo details');
         }
         
         const todo = await response.json();
         
         document.getElementById('editId').value = todo.id;
         document.getElementById('editTitle').value = todo.title;
         document.getElementById('editDescription').value = todo.description || '';
         document.getElementById('editStatus').value = todo.status;
         document.getElementById('editPriority').value = todo.priority;
         
         if (todo.dueDate) {
             // Format the date for the datetime-local input
             const dueDate = new Date(todo.dueDate);
             const formattedDate = dueDate.toISOString().slice(0, 16);
             document.getElementById('editDueDate').value = formattedDate;
         } else {
             document.getElementById('editDueDate').value = '';
         }
         
         const editModal = new bootstrap.Modal(document.getElementById('editTodoModal'));
         editModal.show();
         
     } catch (error) {
         showError(error.message);
     }
 }
 
 // Update a todo
 async function updateTodo() {
     try {
         const id = document.getElementById('editId').value;
         const title = document.getElementById('editTitle').value;
         const description = document.getElementById('editDescription').value;
         const status = parseInt(document.getElementById('editStatus').value);
         const priority = parseInt(document.getElementById('editPriority').value);
         const dueDate = document.getElementById('editDueDate').value;
         
         if (!title.trim()) {
             throw new Error('Title is required');
         }
         
         const todoData = {
             id: id,
             title: title,
             description: description,
             status: status,
             priority: priority,
             dueDate: dueDate || null,
             lastModifiedDate: new Date().toISOString()
         };
         
         const response = await fetch(`${API_BASE_URL}/${id}`, {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(todoData)
         });
         
         if (!response.ok) {
             throw new Error('Failed to update todo');
         }
         
         const modal = bootstrap.Modal.getInstance(document.getElementById('editTodoModal'));
         modal.hide();
         
         document.getElementById('editTodoForm').reset();
         showSuccess('Todo updated successfully');
         loadTodos();
         
     } catch (error) {
         showError(error.message);
     }
 }
 
 // Delete a todo
 async function deleteTodo() {
     try {
         const id = document.getElementById('deleteId').value;
         
         const response = await fetch(`${API_BASE_URL}/${id}`, {
             method: 'DELETE'
         });
         
         if (!response.ok) {
             throw new Error('Failed to delete todo');
         }
         
         const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
         modal.hide();
         
         showSuccess('Todo deleted successfully');
         loadTodos();
         
     } catch (error) {
         showError(error.message);
     }
 }
 
 // Helper functions for styling
 function getPriorityBadgeClass(priority) {
     const classes = {
         0: 'bg-primary',
         1: 'bg-warning text-dark',
         2: 'bg-danger'
     };
     return classes[priority] || 'bg-secondary';
 }
 
 function getStatusBadgeClass(status) {
     const classes = {
         0: 'bg-secondary',
         1: 'bg-info text-dark',
         2: 'bg-success'
     };
     return classes[status] || 'bg-secondary';
 }
 
 // Show success toast
 function showSuccess(message) {
     document.getElementById('successMessage').textContent = message;
     successToast.show();
 }
 
 // Show error toast
 function showError(message) {
     document.getElementById('errorMessage').textContent = message;
     errorToast.show();
 }