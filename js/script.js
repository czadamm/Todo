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

const formSubmit = document.getElementById("form-submit");

formSubmit.addEventListener("click", (event) => {
  event.preventDefault();
});
