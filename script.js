document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const addButton = document.getElementById("add");
    const taskList = document.getElementById("task-list");
    const clearButton = document.getElementById("clear");
    let editMode = false; 
    let taskToEdit = null; 
  
    addButton.addEventListener("click", addOrEditTask);
    clearButton.addEventListener("click", clearTasks);
    taskList.addEventListener("click", handleTaskActions);
  
    loadTasksFromStorage();
  
    function addOrEditTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            if (editMode) {
              
                taskToEdit.firstChild.textContent = taskText;
                updateTaskInStorage(taskToEdit, taskText);
                taskToEdit = null;
                editMode = false;
                addButton.textContent = "Add Task";
            } else {
                const task = document.createElement("li");
                task.innerHTML = `
                    ${taskText}
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                `;
                taskList.appendChild(task);
                saveTaskToStorage(taskText);
            }
            taskInput.value = "";
        } else {
            alert("Please fill the task.");
        }
    }
  
    function handleTaskActions(e) {
        if (e.target.classList.contains("delete")) {
            removeTask(e.target.parentElement);
        } else if (e.target.classList.contains("edit")) {
            editTask(e.target.parentElement);
        }
    }
  
    function editTask(task) {
        taskToEdit = task;
        taskInput.value = task.firstChild.textContent;
        editMode = true;
        addButton.textContent = "Save";
    }
  
    function removeTask(task) {
        const taskText = task.firstChild.textContent;
        task.remove();
        removeTaskFromStorage(taskText);
    }
  
    function clearTasks() {
        taskList.innerHTML = "";
        localStorage.clear();
    }
  
    function saveTaskToStorage(task) {
        let tasks = getTasksFromStorage();
  
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function updateTaskInStorage(taskItem, newText) {
        const tasks = getTasksFromStorage();
        const index = Array.from(taskList.children).indexOf(taskItem);
        tasks[index] = newText;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function removeTaskFromStorage(task) {
        const tasks = getTasksFromStorage();
        const filteredTasks = tasks.filter((t) => t !== task);
        localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    }
  
    function getTasksFromStorage() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }
  
    function loadTasksFromStorage() {
        const tasks = getTasksFromStorage();
        tasks.forEach(function (task) {
            const taskItem = document.createElement("li");
            taskItem.innerHTML = `
                ${task}
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            `;
            taskList.appendChild(taskItem);
        });
    }
  });
  