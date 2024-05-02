import * as utils from "./utils.js";

// get tasks from LocalStorage or [] if not set
const myTasks = JSON.parse(localStorage.getItem("myTasks")) || [];
const doneTasks = JSON.parse(localStorage.getItem("doneTasks")) || [];

function reloadActiveList() {
  const activeList = document.querySelector(".active-tasks > .tasks-list");

  activeList.innerHTML = "";

  if (myTasks.length > 0) {
    myTasks.forEach((task) => {
      const currentDate = new Date().getTime();
      const timeLeft = task.dueMillis - currentDate;

      const daysLeft = timeLeft / (1000 * 60 * 60 * 24);
      const absoluteDays = Math.floor(daysLeft);
      const d = absoluteDays > 9 ? absoluteDays : "0" + absoluteDays;

      const hoursLeft = (daysLeft - absoluteDays) * 24;
      const absoluteHours = Math.floor(hoursLeft);
      const h = absoluteHours > 9 ? absoluteHours : "0" + absoluteHours;

      const minutesLeft = (hoursLeft - absoluteHours) * 60;
      const absoluteMinutes = Math.floor(minutesLeft);
      const m = absoluteMinutes > 9 ? absoluteMinutes : "0" + absoluteMinutes;

      let timerContent = "";

      if (d > 1) {
        timerContent = d + "days";
      } else if ((d <= 1) & (h > 1)) {
        timerContent = h + " hours";
      } else if ((d == 0) & (h == 1)) {
        timerContent = h + " hour" + m + " minutes";
      } else if ((d == 0) & (h == 0)) {
        timerContent = m + " minutes";
      } else if (m < 1) {
        timerContent = "less than 1 minute";
      } else {
        timerContent = "past due";
      }

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
          <div class="progress-bar" data-key=${task.id}>
            <div class="progress-left"></div>
          </div>
          <p class="time-left">${timerContent}</p>
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
  reloadProgressBars();
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
    due: taskDate.toLocaleString(),
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

function reloadProgressBars() {
  const progressBars = document.querySelectorAll(".progress-left");

  progressBars.forEach((bar) => {
    const taskId = bar.parentNode.dataset.key;
    const index = myTasks.findIndex((task) => task.id === taskId);
    const task = myTasks[index];

    let width = task.progress;
    bar.style.width = width + "%";

    if (width < 50) {
      bar.style.backgroundColor = "#ebd515";
      bar.style.boxShadow = "0 0 4px 2px #fff496";
    }

    if (width < 25) {
      bar.style.backgroundColor = "#e74200";
      bar.style.boxShadow = "0 0 4px 2px #ffb496";
    }

    if (width < 10) {
      bar.style.backgroundColor = "#e2004b";
      bar.style.boxShadow = "0 0 4px 2px #ffd2d2";
      bar.parentNode.className = "progress-bar low-time";
    }

    if (myTasks.length) {
      myTasks[index].progress = width;
      localStorage.setItem("myTasks", JSON.stringify(myTasks));
    }

    const totalTimeForTask = task.dueMillis - task.start;
    const step = totalTimeForTask / 100;

    let inProgress = false;

    if (!inProgress) {
      inProgress = true;

      const interval = setInterval(countdown, step);

      function countdown() {
        if (width <= 0) {
          clearInterval(interval);
          inProgress = false;
          bar.style.width = width + "%";
          bar.style.boxShadow = "0 0 4px 2px #ffd2d2";
          bar.parentNode.className = "progress-bar low-time";
        } else {
          width -= 1;
          bar.style.width = width + "%";

          if (width < 50) {
            bar.style.backgroundColor = "#ebd515";
            bar.style.boxShadow = "0 0 4px 2px #fff496";
          }

          if (width < 25) {
            bar.style.backgroundColor = "#e74200";
            bar.style.boxShadow = "0 0 4px 2px #ffb496";
          }

          if (width < 10) {
            bar.style.backgroundColor = "#e2004b";
            bar.style.boxShadow = "0 0 4px 2px #ffd2d2";
            bar.parentNode.className = "progress-bar low-time";
          }

          if (myTasks.length) {
            myTasks[index].progress = width;
            localStorage.setItem("myTasks", JSON.stringify(myTasks));
          }
        }
      }
    }
  });
}
