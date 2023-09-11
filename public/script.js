const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterAllButton = document.getElementById('filter-all');
const filterActiveButton = document.getElementById('filter-active');
const filterCompletedButton = document.getElementById('filter-completed');
const clearAllButton = document.getElementById('clear-all');
let tasks = [];

window.addEventListener('load', () => {
	const storedTasks = localStorage.getItem('tasks');
	if (storedTasks) {
		tasks = JSON.parse(storedTasks);
		renderTasks();
	}
});

taskForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const newTaskName = taskInput.value.trim();
	if (newTaskName !== '') {
		tasks.push({ taskName: newTaskName, completed: false });
		saveTasksToLocalStorage();
		renderTasks();
		taskInput.value = '';
	}
});

taskList.addEventListener('click', (event) => {
	const target = event.target;
	const clickedTaskIndex = parseInt(target.dataset.index);
	if (!isNaN(clickedTaskIndex)) {
		if (target.classList.contains('update-button')) {
			tasks[clickedTaskIndex].completed = !tasks[clickedTaskIndex].completed;
			saveTasksToLocalStorage();
			renderTasks();
		} else if (target.classList.contains('delete-button')) {
			tasks.splice(clickedTaskIndex, 1);
			saveTasksToLocalStorage();
			renderTasks();
		} else if (target.classList.contains('edit-button')) {
			// Replace the task name with an input field for editing
			const taskElement = target.parentElement;
			const taskNameElement = taskElement.querySelector('.task-name');
			const currentTaskName = taskNameElement.textContent;

			const inputField = document.createElement('input');
			inputField.type = 'text';
			inputField.value = currentTaskName;

			inputField.addEventListener('keyup', (e) => {
				if (e.key === 'Enter') {
					const newTaskName = inputField.value.trim();
					if (newTaskName !== '') {
						editTask(clickedTaskIndex, newTaskName);
					}
				}
			});

			taskNameElement.textContent = '';
			taskNameElement.appendChild(inputField);
			inputField.focus();
		}
	}
});


filterAllButton.addEventListener('click', () => {
	renderTasks();
});

filterActiveButton.addEventListener('click', () => {
	const activeTasks = tasks.filter(task => !task.completed);
	renderTasks(activeTasks);
});

filterCompletedButton.addEventListener('click', () => {
	const completedTasks = tasks.filter(task => task.completed);
	renderTasks(completedTasks);
});

clearAllButton.addEventListener('click', () => {
	tasks = [];
	saveTasksToLocalStorage();
	renderTasks();
});

function editTask(index, newTaskName) {
	tasks[index].taskName = newTaskName;
	saveTasksToLocalStorage();
	renderTasks();
}

function saveTasksToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filteredTasks = tasks) {
	taskList.innerHTML = '';
	if (filteredTasks.length === 0) {
		const noTasksElement = document.createElement('div');
		noTasksElement.classList.add('no-tasks');
		noTasksElement.textContent = 'No tasks to display.';
		taskList.appendChild(noTasksElement);
	} else {
		filteredTasks.forEach((task, index) => {
			const taskElement = document.createElement('div');
			taskElement.classList.add('task');
			taskElement.dataset.index = index;
			taskElement.innerHTML = `
                <span class="task-name ${task.completed ? 'completed' : ''}">${task.taskName}</span>
                <button class="delete-button" data-index="${index}">Delete</button>
                <button class="update-button" data-index="${index}">Update</button>
                <button class="edit-button" data-index="${index}">Edit</button>
            `;
			taskList.appendChild(taskElement);
		});
	}
}

// Initial rendering
renderTasks();
