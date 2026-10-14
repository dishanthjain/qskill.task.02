// Task Manager Frontend JavaScript

class TaskManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.currentFilter = 'all'; // all, active, completed
        this.tasks = [];
        
        // Bind methods
        this.fetchTasks = this.fetchTasks.bind(this);
        this.addTask = this.addTask.bind(this);
        this.toggleTaskComplete = this.toggleTaskComplete.bind(this);
        this.editTask = this.editTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.renderTasks = this.renderTasks.bind(this);
        this.renderStats = this.renderStats.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        // Event listeners
        document.getElementById('taskForm').addEventListener('submit', this.handleFormSubmit);
        document.getElementById('filterAll').addEventListener('click', () => this.setFilter('all'));
        document.getElementById('filterActive').addEventListener('click', () => this.setFilter('active'));
        document.getElementById('filterCompleted').addEventListener('click', () => this.setFilter('completed'));
        
        // Initial load
        this.fetchTasks();
    }
    
    // API Methods
    async fetchTasks() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks`);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            this.tasks = await response.json();
            this.renderTasks();
            this.renderStats();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            this.renderTasks();
        }
    }
    
    async addTask(taskData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            
            if (!response.ok) throw new Error('Failed to add task');
            const newTask = await response.json();
            this.tasks.push(newTask);
            this.renderTasks();
            this.renderStats();
            return newTask;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    }
    
    async updateTask(id, taskData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            
            if (!response.ok) throw new Error('Failed to update task');
            const updatedTask = await response.json();
            
            // Update in local state
            const index = this.tasks.findIndex(task => task._id === id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
            }
            
            this.renderTasks();
            this.renderStats();
            return updatedTask;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }
    
    async deleteTask(id) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete task');
            
            // Remove from local state
            this.tasks = this.tasks.filter(task => task._id !== id);
            this.renderTasks();
            this.renderStats();
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
    
    async toggleTaskComplete(id) {
        try {
            const task = this.tasks.find(t => t._id === id);
            if (!task) throw new Error('Task not found');
            
            const response = await fetch(`${this.apiBaseUrl}/tasks/${id}/toggle`, {
                method: 'PATCH'
            });
            
            if (!response.ok) throw new Error('Failed to toggle task');
            const updatedTask = await response.json();
            
            // Update in local state
            const index = this.tasks.findIndex(task => task._id === id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
            }
            
            this.renderTasks();
            this.renderStats();
            return updatedTask;
        } catch (error) {
            console.error('Error toggling task:', error);
            throw error;
        }
    }
    
    // Event Handlers
    handleFormSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        
        if (!title) {
            alert('Please enter a task title');
            return;
        }
        
        this.addTask({ title, description })
            .then(() => {
                // Reset form
                document.getElementById('taskForm').reset();
            })
            .catch(error => {
                alert('Failed to add task: ' + error.message);
            });
    }
    
    // Filter Methods
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        switch(filter) {
            case 'all':
                document.getElementById('filterAll').classList.add('active');
                break;
            case 'active':
                document.getElementById('filterActive').classList.add('active');
                break;
            case 'completed':
                document.getElementById('filterCompleted').classList.add('active');
                break;
        }
        
        this.renderTasks();
    }
    
    getFilteredTasks() {
        switch(this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }
    
    // Render Methods
    renderTasks() {
        const container = document.getElementById('tasksContainer');
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <p class="empty-state">No tasks found. Add a new task to get started!</p>
            `;
            return;
        }
        
        container.innerHTML = filteredTasks.map(task => `
            <div class="task-item" data-id="${task._id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <h3 class="task-title ${task.completed ? 'completed' : ''}">${task.title}</h3>
                    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-small btn-edit" onclick="taskManager.editTask('${task._id}')">Edit</button>
                    <button class="btn-small btn-delete" onclick="taskManager.deleteTask('${task._id}')">Delete</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to checkboxes
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = e.target.closest('.task-item').dataset.id;
                this.toggleTaskComplete(taskId);
            });
        });
        
        // Add click listener to show/hide description
        document.querySelectorAll('.task-title').forEach(title => {
            title.addEventListener('click', (e) => {
                const taskItem = e.target.closest('.task-item');
                const description = taskItem.querySelector('.task-description');
                if (description) {
                    description.classList.toggle('show');
                }
            });
        });
    }
    
    renderStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const active = total - completed;
        
        const statsHtml = `
            <div class="stat-item">
                <span class="stat-number">${total}</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${active}</span>
                <span class="stat-label">Active</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${completed}</span>
                <span class="stat-label">Completed</span>
            </div>
        `;
        
        document.getElementById('statsContainer').innerHTML = statsHtml;
    }
    
    // Edit task (simple implementation using prompt)
    editTask(id) {
        const task = this.tasks.find(t => t._id === id);
        if (!task) return;
        
        const newTitle = prompt('Edit task title:', task.title);
        if (newTitle === null || newTitle.trim() === '') return;
        
        const newDescription = prompt('Edit task description:', task.description || '');
        
        this.updateTask(id, {
            title: newTitle.trim(),
            description: newDescription.trim()
        }).catch(error => {
            alert('Failed to update task: ' + error.message);
        });
    }
}

// Initialize the task manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});
