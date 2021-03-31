'use strict';

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


const inputTask = document.querySelector(".field__content--input");
const containerList = document.querySelector(".list");
const buttonAll = document.querySelector(".items__tab--1");
const buttonActive = document.querySelector(".items__tab--2");
const buttonCompleted = document.querySelector(".items__tab--3");
const buttonClearCompleted = document.querySelector(".items__delete");
const itemLeft = document.querySelector(".left");

let tasks = [
  {
    name: "Test 1 ND",
    status: 0
  },
  {
    name: "Test 2 D",
    status: 1
  },
  {
    name: "Test 3 ND",
    status: 0
  },
  {
    name: "Test 4 D",
    status: 1
  }
];

//////////////////////////////////////////////////////////
////////// Functions


function showAllTasks(){
// containerList.innerHTML = "";
tasks.forEach(function(item, index){
  showTask(item.name, index);
});
}

function showTask(taskName, index){
  const html = `<div class="field">
  <input type="checkbox" name="task" id="task--${(index+1)}" class="field__checkbox--input">
  <label for="task--${(index+1)}" class="field__label">
    <span class="field__checkbox">
      <img src="images/icon-check.svg" alt="" class="field__icon field__icon--check">
    </span>
  </label>
  <div class="field__content">
    ${taskName}
  </div>
  <img src="images/icon-cross.svg" class="field__icon field__icon--cross">
  </div> `;

  containerList.insertAdjacentHTML('afterbegin', html);
}

function updateLeftItems(){
  itemLeft.innerHTML = tasks.filter( (ele) => ele.status ===0 ).reduce( (curr, ele) => curr +1 , 0);
}

function deleteTask(index){
  tasks.splice(index, 1);
}

/////////////////
// Add a task
inputTask.addEventListener("keyup", function(e) {
  if(e.keyCode === 13){
    const name = inputTask.value.trim();
    inputTask.value ="";

    tasks.push({
      name, status: 0
    })

    showTask(name, tasks.length);
    updateLeftItems();
  }
});

////////////////////////////////////////////
/// show completed

buttonCompleted.addEventListener("click", function(){
  containerList.innerHTML ="";
  tasks.filter( (ele) => ele.status === 1 ).forEach(function(item, index){
    showTask(item.name, index);
  });
});

buttonAll.addEventListener("click", showAllTasks);

buttonActive.addEventListener("click", function(){
  containerList.innerHTML ="";
  tasks.filter( (ele) => ele.status === 0 ).forEach(function(item, index){
    showTask(item.name, index);
  });
});

buttonClearCompleted.addEventListener("click", function(){
  
  const idx = tasks.map((ele, index) => ele.status === 1? index : -1);
  idx.reverse();
  console.log(tasks);
  idx.forEach(function(ele){
    if(ele > 0){
      deleteTask(ele);
    }
  });
  console.log(tasks);
  showAllTasks();
});


/////////////////////////////////////////
//STArTER
function init(){
  showAllTasks();
  updateLeftItems();
}

init();







