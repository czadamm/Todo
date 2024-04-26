import * as utils from "./utils.js";

const buttonAddTask = document.getElementById("add-task");
const dialog = document.getElementById("modal");

// open modal
buttonAddTask.addEventListener("click", () => {
  dialog.showModal();
});

// modal
const dialogClose = document.getElementById("modal-close");
const errorMessage = document.getElementById("validation-message");

const closeModalHandler = () => {
  dialog.classList.remove("hide");
  errorMessage.classList.remove("error");
  dialog.close();
  dialog.removeEventListener("webkitAnimationEnd", closeModalHandler, false);
};

dialogClose.addEventListener("click", () => {
  dialog.classList.add("hide");
  dialog.addEventListener("webkitAnimationEnd", closeModalHandler, false);
});
// end modal

// loading tasks from LocalStorage
const myTasks = JSON.parse(localStorage.getItem("myTasks")) || [];

// conditionally change button text and paragraph
const paragraph = document.getElementById("actions-paragraph");

if (myTasks.length === 0) {
  buttonAddTask.innerText = "add your first task";
  paragraph.innerText =
    "Seems like you don't have any task yet, use button belowe to create one!";
} else {
  buttonAddTask.textContent = "add task";
  paragraph.textContent = "";

  reloadActiveList();
}
// end conditionally change button text and paragraph

function reloadActiveList() {
  const activeList = document.querySelector(".active-tasks > .tasks-list");
  console.log(activeList);

  activeList.innerHTML = "";

  if (myTasks.length > 0) {
    myTasks.forEach((task) => {
      const singleTask = document.createElement("li");
      singleTask.id = task.id;
      singleTask.className = "task-item";
      singleTask.innerHTML = `<div>
      <div class="task-actions">
      <button class="complete">
      <i class="fa-solid fa-check"></i>
        </button>
      <div>
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
  }
}

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

  errorMessage.classList.add("success");
}

function checkInput(input) {
  if (input.value.trim() === "") {
    errorMessage.textContent = "all fields are required!";
    errorMessage.classList.add("error");

    throw new Error(input.name + "can not be empty");
  } else {
    errorMessage.textContent = "task added successfully";

    setTimeout(() => {
      dialog.classList.add("hide");
      dialog.addEventListener("webkitAnimationEnd", closeModalHandler, false);
      errorMessage.classList.remove("success");
    }, 2000);
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

  const task = {
    id,
    task: taskText,
    due: taskDate,
    priority: false,
  };

  addTask(task);
  inputText.value = "";
  date.value = "";
});
// end adding task to array and to LocalStorage

// fetching tasks list from LocalStorage
