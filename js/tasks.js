import * as utils from "./utils.js";

// get tasks from LocalStorage or [] if not set
const myTasks = JSON.parse(localStorage.getItem("myTasks")) || [];
const doneTasks = JSON.parse(localStorage.getItem("doneTasks")) || [];

function reloadActiveList() {
  const activeList = document.querySelector(".active-tasks > .tasks-list");

  activeList.innerHTML = "";

  if (myTasks.length > 0) {
    myTasks.forEach((task) => {
      const singleTask = document.createElement("li");
      singleTask.id = task.id;
      singleTask.className = "task-item";
      singleTask.innerHTML = `
        <div>
          <div class="task-actions">
            <button class="complete">
              <i class="fa-solid fa-check"></i>
            </button>
            <div data-key=${task.id}>
              <button class="priority">
                <i class="fa-regular fa-star"></i>
              </button>
              <button class="remove">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <h3>${task.task}</h3>
          <p>Due: ${task.due}</p>
        </div>
        <div class="progress-bar">
          <label for="progress">Time left:</label>
          <progress id="progress" value="50" max="100"></progress>
        </div>`;

      activeList.appendChild(singleTask);
    });
  } else {
    activeList.innerHTML =
      "<p class='no-tasks-msg'>You don't have any task</p>";
  }

  addEventsToButtons();
}
reloadActiveList();

function reloadCompleteList() {
  const doneList = document.querySelector(".past-tasks > .tasks-list");

  doneList.innerHTML = "";

  if (doneTasks.length > 0) {
    doneTasks.forEach((task) => {
      const singleTask = document.createElement("li");
      singleTask.id = task.id;
      singleTask.className = "task-item";
      singleTask.innerHTML = `<h3>${task.task}</h3>
      <p>Due date: ${task.due}</p>
      <p>Completion date: ${task.done}</p>`;

      doneList.appendChild(singleTask);
    });
  } else {
    doneList.innerHTML = "<p class='no-tasks-msg'>No complete tasks</p>";
  }
}
reloadCompleteList();

const errorMessage = document.getElementById("validation-message");

// adding task to array and to LocalStorage
function addTask(task) {
  myTasks.push(task);
  localStorage.setItem("myTasks", JSON.stringify(myTasks));

  reloadActiveList();

  const lastTask = document.querySelector(
    ".active-tasks > .tasks-list > li:last-of-type"
  );

  function removeNewClass() {
    lastTask.classList.remove("hide");
    lastTask.removeEventListener("webkitAnimationEnd", removeNewClass, false);
  }

  lastTask.classList.add("new-task");
  lastTask.addEventListener("webkitAnimationEnd", removeNewClass, false);
}

function checkInput(input) {
  if (input.value.trim() === "") {
    errorMessage.textContent = "all fields are required!";
    errorMessage.classList.add("error");

    throw new Error(input.name + " can not be empty");
  } else {
    errorMessage.textContent = "task added successfully";
  }
}

const formSubmit = document.getElementById("add-task-form");

formSubmit.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputText = document.getElementById("task-input");
  const date = document.getElementById("task-date");

  inputText.addEventListener("change", () => {
    errorMessage.classList.remove("error");
  });
  date.addEventListener("change", () => {
    errorMessage.classList.remove("error");
  });

  checkInput(inputText);
  checkInput(date);

  const id = utils.randomId(1, 2);
  const taskText = inputText.value;
  const taskDate = new Date(date.value).toLocaleDateString();
  const doneDate = "";

  const task = {
    id,
    task: taskText,
    due: taskDate,
    done: doneDate,
    priority: false,
  };

  addTask(task);
  inputText.value = "";
  date.value = "";
});
// end adding task to array and to LocalStorage

function removeTask(index) {
  myTasks.splice(index, 1);
  localStorage.setItem("myTasks", JSON.stringify(myTasks));

  reloadActiveList();
}

function addTaskToComplete(task) {
  doneTasks.push(task);
  localStorage.setItem("doneTasks", JSON.stringify(doneTasks));

  reloadCompleteList();

  const lastTask = document.querySelector(
    ".past-tasks > .tasks-list > li:last-of-type"
  );

  function removeNewClass() {
    lastTask.classList.remove("hide");
    lastTask.removeEventListener("webkitAnimationEnd", removeNewClass, false);
  }

  lastTask.classList.add("new-task");
  lastTask.addEventListener("webkitAnimationEnd", removeNewClass, false);
}

// adding events to task buttons
const dialog = document.getElementById("modal");

function addEventsToButtons() {
  // removing tasks
  const removeButtons = document.querySelectorAll("button.remove");
  removeButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const taskId = button.parentNode.dataset.key;
      const index = myTasks.findIndex((task) => task.id === taskId);

      dialog.showModal();

      const confirmButton = document.getElementById("confirm-btn");

      function removeEvent() {
        removeTask(index);
        confirmButton.removeEventListener("click", removeEvent, false);
        // event is removing to avoid duplicate listener after reload a list

        dialog.classList.add("hide");
        dialog.addEventListener("webkitAnimationEnd", closeModalHandler, false);
      }

      confirmButton.addEventListener("click", removeEvent, false);

      const dialogClose = document.getElementById("cancel-btn");
      const closeModalHandler = () => {
        dialog.classList.remove("hide");
        dialog.close();
        dialog.removeEventListener(
          "webkitAnimationEnd",
          closeModalHandler,
          false
        );
      };
      dialogClose.addEventListener("click", () => {
        dialog.classList.add("hide");
        dialog.addEventListener("webkitAnimationEnd", closeModalHandler, false);
      });
    })
  );

  // completing tasks
  const completeButtons = document.querySelectorAll("button.complete");
  completeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const taskId = button.parentNode.dataset.key;
      const index = myTasks.findIndex((task) => task.id === taskId);
      const task = myTasks.splice(index, 1);

      task[0].done = new Date().toLocaleDateString();

      addTaskToComplete(task[0]);
      removeTask(index);
    });
  });
}
