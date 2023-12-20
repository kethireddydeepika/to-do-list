var highPriorityTasks = [];
var lowPriorityTasks = [];


function displayTasks() {
  var highPriorityContainer = document.getElementById("highPriorityContainer");
  var lowPriorityContainer = document.getElementById("lowPriorityContainer");
  highPriorityContainer.innerHTML = "";
  lowPriorityContainer.innerHTML = "";

  highPriorityTasks.forEach(function (task, index) {
    var taskItem = createTaskElement(task, index, "high-priority");
    highPriorityContainer.appendChild(taskItem);
  });

  lowPriorityTasks.forEach(function (task, index) {
    var taskItem = createTaskElement(task, index, "low-priority");
    lowPriorityContainer.appendChild(taskItem);
  });
}

function createTaskElement(task, index, priorityClass) {
  var taskItem = document.createElement("div");
  taskItem.className = "todo-item";
  taskItem.classList.add(priorityClass);

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", function () {
    task.done = this.checked;
    displayTasks();
    saveTasksToLocalStorage();
  });

  var label = document.createElement("label");
  label.textContent = task.description + " (Deadline: " + task.deadline + ")";
  if (task.done) {
    label.style.textDecoration = "line-through";
  }

  var deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("data-index", index);
  deleteButton.addEventListener("click", function () {
    if (priorityClass === "high-priority") {
      highPriorityTasks.splice(index, 1);
    } else {
      lowPriorityTasks.splice(index, 1);
    }
    displayTasks();
    saveTasksToLocalStorage();
  });

  taskItem.appendChild(checkbox);
  taskItem.appendChild(label);
  taskItem.appendChild(deleteButton);

  return taskItem;
}


function saveTasksToLocalStorage() {
  localStorage.setItem("highPriorityTasks", JSON.stringify(highPriorityTasks));
  localStorage.setItem("lowPriorityTasks", JSON.stringify(lowPriorityTasks));
}


function loadTasksFromLocalStorage() {
  var storedHighPriorityTasks = localStorage.getItem("highPriorityTasks");
  var storedLowPriorityTasks = localStorage.getItem("lowPriorityTasks");

  if (storedHighPriorityTasks) {
    highPriorityTasks = JSON.parse(storedHighPriorityTasks);
  }

  if (storedLowPriorityTasks) {
    lowPriorityTasks = JSON.parse(storedLowPriorityTasks);
  }

  displayTasks();
}


document.getElementById("addButton").addEventListener("click", function () {
  var taskInput = document.getElementById("taskInput");
  var deadlineInput = document.getElementById("deadlineInput");

  if (taskInput.value !== "") {
    var newTask = {
      description: taskInput.value,
      deadline: deadlineInput.value, 
      done: false
    };

    if (deadlineInput.value !== "") {
      var taskDeadline = new Date(deadlineInput.value);
      var today = new Date();



      today.setHours(23, 59, 59, 999);

      if (taskDeadline.getTime() <= today.getTime()) {
        highPriorityTasks.push(newTask);
      } else {
        lowPriorityTasks.push(newTask);
      }
    } else {

      lowPriorityTasks.push(newTask);
    }

    displayTasks();
    saveTasksToLocalStorage();

    taskInput.value = "";
    deadlineInput.value = ""; 
  }
});

loadTasksFromLocalStorage();