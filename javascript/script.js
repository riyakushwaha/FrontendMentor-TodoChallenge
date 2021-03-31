const mode_checkbox = document.querySelector("#app__current-theme");
mode_checkbox.addEventListener("change", (event) =>{
    if (event.currentTarget.checked) {
        document.querySelector(".app__icon-sun").setAttribute("src", "images/icon-moon.svg")
        document.documentElement.dataset.theme = "light";
      } else {
        document.querySelector(".app__icon-sun").setAttribute("src", "images/icon-sun.svg")
        document.documentElement.dataset.theme = "dark";
      }
});

// Functionality of ToDo Application

const all = [];
const completed = [];
const left = [];