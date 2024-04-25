import { TASKS } from "./tasks.js";
import * as utils from "./utils.js";

const button = document.getElementById("add-task");
const dialog = document.getElementById("modal");

button.addEventListener("click", () => {
  dialog.showModal();
});

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

const formSubmit = document.getElementById("add-task-form");

const myTasks = JSON.parse(localStorage.getItem("myTasks"));

const addTask = (task) => {
  myTasks.push(task);

  localStorage.setItem("myTasks", JSON.stringify(myTasks));
};

formSubmit.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = document.getElementById("task-input");
  const date = document.getElementById("task-date");

  if (input.value.trim() === "" || date.value === "") {
    throw new Error("all fields are required");
  }

  const id = utils.randomId(1, 2);
  const taskText = input.value;
  const taskDate = new Date(date.value).toLocaleDateString();

  const task = {
    id,
    task: taskText,
    due: taskDate,
    priority: false,
  };

  addTask(task);
});

console.log(myTasks);
