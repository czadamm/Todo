import * as utils from "./utils.js";

// get tasks from LocalStorage or [] if not set
const myTasks = JSON.parse(localStorage.getItem("myTasks")) || [];

const buttonAddTask = document.getElementById("add-task-btn");
const buttonMyTasks = document.getElementById("my-tasks-btn");
const paragraph = document.getElementById("actions-paragraph");

if (myTasks.length === 0) {
  buttonAddTask.className = "btn-active";
  buttonMyTasks.className = "";
  paragraph.innerText =
    "Seems like you don't have any task yet, use button belowe to create one!";
} else {
  buttonAddTask.className = "";
  buttonMyTasks.className = "btn-active";
  paragraph.textContent = "";
}

buttonMyTasks.addEventListener("click", () => {
  location.href = "/tasks.html";
});

// end conditionally change button and paragraph text

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

// adding task to array and to LocalStorage
function addTask(task) {
  myTasks.push(task);
  localStorage.setItem("myTasks", JSON.stringify(myTasks));

  errorMessage.classList.add("success");

  setTimeout(() => {
    dialog.classList.add("hide");
    dialog.addEventListener("webkitAnimationEnd", closeModalHandler, false);
    errorMessage.classList.remove("success");
    location.href = "/tasks.html";
  }, 2000);
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
