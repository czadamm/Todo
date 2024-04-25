import * as utils from "./utils.js";

const buttonAddTask = document.getElementById("add-task");
const dialog = document.getElementById("modal");

// open modal
buttonAddTask.addEventListener("click", () => {
  dialog.showModal();
});

// modal
const dialogClose = document.getElementById("modal-close");

const closeModalHandler = () => {
  dialog.classList.remove("hide");
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
  buttonAddTask.innerText = "add task";
  paragraph.innerText = "";
}
// end conditionally change button text and paragraph

// adding task to array and to LocalStorage
function addTask(task) {
  myTasks.push(task);
  localStorage.setItem("myTasks", JSON.stringify(myTasks));
}

function checkInput(input) {
  if (input.value.trim() === "") {
    input.classList.add("error");
    console.log(input.name + " can not be empty");
  }
}

const formSubmit = document.getElementById("add-task-form");

formSubmit.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = document.getElementById("task-input");
  const date = document.getElementById("task-date");

  checkInput(input);
  checkInput(date);

  const id = utils.randomId(1, 2);
  let taskText = input.value;
  let taskDate = new Date(date.value).toLocaleDateString();

  const task = {
    id,
    task: taskText,
    due: taskDate,
    priority: false,
  };

  addTask(task);
});
// end adding task to array and to LocalStorage
