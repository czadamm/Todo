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
            <div data-key=${task.id}>
              <button class="complete">
                <i class="fa-solid fa-check"></i>
              </button>
            </div>
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
        <div class="progress-bar-section">
          <p class="progress-label">Time left:</label>
          <div id="progress-bar">
            <div id="progress-left"></div>
          </div>
          <p class="progress-label" id="timeLeft">1d 22h 3m</p>
        </div>`;

      activeList.appendChild(singleTask);
    });
  } else {
    activeList.innerHTML =
      "<p class='no-tasks-msg'>You don't have any task</p>";
  }

  addEventsToRemoveButtons();
  addEventsToCompleteButtons();
  addEventsToPriorityButtons();
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
      <p>Due date: <span>${task.due}</span></p>
      <p>Completion date: <span>${task.done}</span></p>`;

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
  myTasks.unshift(task);
  localStorage.setItem("myTasks", JSON.stringify(myTasks));

  reloadActiveList();

  const lastTask = document.querySelector(
    ".active-tasks > .tasks-list > li:first-of-type"
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
  const startDate = new Date().getTime();
  const taskDate = new Date(date.value);
  const dueMillis = taskDate.getTime();
  const doneDate = "";

  const task = {
    id,
    task: taskText,
    start: startDate,
    due: taskDate.toLocaleDateString(),
    dueMillis: dueMillis,
    done: doneDate,
    priority: false,
    progress: 100,
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

function addTaskToComplete(task, index) {
  doneTasks.unshift(task);
  localStorage.setItem("doneTasks", JSON.stringify(doneTasks));

  removeTask(index);
  reloadCompleteList();

  const lastTask = document.querySelector(
    ".past-tasks > .tasks-list > li:first-of-type"
  );

  function removeNewClass() {
    lastTask.classList.remove("hide");
    lastTask.removeEventListener("webkitAnimationEnd", removeNewClass, false);
  }

  lastTask.classList.add("new-task");
  lastTask.addEventListener("webkitAnimationEnd", removeNewClass, false);
}

// adding events to task buttons

// removing tasks
function addEventsToRemoveButtons() {
  const dialog = document.getElementById("modal");
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
}

// completing tasks
function addEventsToCompleteButtons() {
  const completeButtons = document.querySelectorAll("button.complete");

  completeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const taskId = button.parentNode.dataset.key;
      const index = myTasks.findIndex((task) => task.id === taskId);

      myTasks[index].done = new Date().toLocaleDateString();

      addTaskToComplete(myTasks[index], index);
    });
  });
}

function addEventsToPriorityButtons() {
  const priorityButtons = document.querySelectorAll("button.priority");

  priorityButtons.forEach((button) => {
    button.innerHTML = "";

    const taskId = button.parentNode.dataset.key;
    const index = myTasks.findIndex((task) => task.id === taskId);

    if (myTasks[index].priority === true) {
      button.innerHTML = "<i class='fa-solid fa-star'></i>";
    } else {
      button.innerHTML = "<i class='fa-regular fa-star'></i>";
    }

    button.addEventListener("click", () => {
      myTasks[index].priority = !myTasks[index].priority;
      localStorage.setItem("myTasks", JSON.stringify(myTasks));

      reloadActiveList();
    });
  });
}

// progress bar

myTasks.forEach((task) => {
  const timeForTask = task.dueMillis - task.start;
  const step = timeForTask / 100;

  let inProgress = false;
  function startCountdown() {
    if (!inProgress) {
      inProgress = true;

      const progress = document.getElementById("progress-left");
      const progressBG = document.getElementById("progress-bar");
      let width = 100;
      // let width = task.progress;

      const interval = setInterval(countdown, 1000);

      function countdown() {
        if (width <= 0) {
          clearInterval(interval);
          inProgress = false;
        } else {
          width -= 1;
          progress.style.width = width + "%";

          if (width < 10) {
            progressBG.className = "low-time";
          }

          // myTasks[index].progress = width;
          // localStorage.setItem("myTasks", JSON.stringify(myTasks));
        }
      }
    }
  }

  startCountdown();
});
