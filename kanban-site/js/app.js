const tasks = [
    { id: 1, title: "Task 1", description: "Description for Task 1", status: "todo" },
    { id: 2, title: "Task 2", description: "Description for Task 2", status: "in-progress" },
    { id: 3, title: "Task 3", description: "Description for Task 3", status: "done" }
];

function renderTasks() {
    const todoList = document.getElementById("todo-list");
    const inProgressList = document.getElementById("in-progress-list");
    const doneList = document.getElementById("done-list");

    todoList.innerHTML = '';
    inProgressList.innerHTML = '';
    doneList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.draggable = true;
        taskElement.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <button onclick="removeTask(${task.id})">Remove</button>
        `;
        taskElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", task.id);
        });

        if (task.status === "todo") {
            todoList.appendChild(taskElement);
        } else if (task.status === "in-progress") {
            inProgressList.appendChild(taskElement);
        } else if (task.status === "done") {
            doneList.appendChild(taskElement);
        }
    });
}

function addTask() {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
        status: "todo"
    };
    tasks.push(newTask);
    renderTasks();
    document.getElementById("task-title").value = '';
    document.getElementById("task-description").value = '';
}

function removeTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index > -1) {
        tasks.splice(index, 1);
        renderTasks();
    }
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e, status) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const task = tasks.find(task => task.id == id);
    if (task) {
        task.status = status;
        renderTasks();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById('add-task');
    const taskInput = document.getElementById('task-input');
    const columns = {
        'todo-list': document.getElementById('todo-list'),
        'in-progress-list': document.getElementById('in-progress-list'),
        'done-list': document.getElementById('done-list')
    };

    function createTaskElement(text) {
        const task = document.createElement('div');
        task.className = 'task';
        task.draggable = true;
        task.textContent = text;

        // Actions (delete)
        const actions = document.createElement('div');
        actions.className = 'actions';

        const delBtn = document.createElement('button');
        delBtn.innerHTML = '🗑️';
        delBtn.title = 'Remover';
        delBtn.onclick = () => task.remove();

        actions.appendChild(delBtn);
        task.appendChild(actions);

        // Drag events
        task.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', null); // for Firefox
            task.classList.add('dragging');
            window.draggedTask = task;
        });
        task.addEventListener('dragend', () => {
            task.classList.remove('dragging');
            window.draggedTask = null;
        });

        return task;
    }

    addTaskBtn.addEventListener('click', () => {
        const value = taskInput.value.trim();
        if (value) {
            const task = createTaskElement(value);
            columns['todo-list'].appendChild(task);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTaskBtn.click();
    });

    // Drag and drop for columns
    Object.values(columns).forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');
            const task = window.draggedTask;
            if (task) column.appendChild(task);
        });
    });
});