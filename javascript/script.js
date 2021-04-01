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
const buttonTabs = document.querySelectorAll(".btn--tab");

// let tasks = [];

let tasks = [
  {
    name: "Jog around the park 3x",
    status: 1
  },
  {
    name: "10 minutes meditation",
    status: 0
  },
  {
    name: "Read for 1 hour",
    status: 0
  },
  {
    name: "Complete Todo App on Frontend Mentor",
    status: 1
  }
];

//////////////////////////////////////////////////////////
////////// Functions

function removeActiveFromAll(){
  buttonTabs.forEach(function(btn){
    btn.classList.remove("active");
  });
}

function swapArrayElement(src, dest){
  const temp = tasks[src];
  tasks[src] = tasks[dest];
  tasks[dest] = temp;
}

function showAllTasks(){

containerList.innerHTML = "";
removeActiveFromAll();
buttonAll.classList.add("active");

tasks.forEach(function(item, index){
  showTask(item.name, index);
});
}

function showTask(taskName, index){

  let html = "";
  if(tasks[index].status === 0){
  html = `<div class="field" draggable="true">
  <input type="checkbox" name="task" data-index="${(index)}" id="data-${(index+1)}" class="field__checkbox--input">
  <label for="data-${(index+1)}" class="field__label">
    <span class="field__checkbox">
      <img src="images/icon-check.svg" alt="" class="field__icon field__icon--check">
    </span>
  </label>
  <div class="field__content">
    ${taskName}
  </div>
  <a href="#" class="cross">
          <img src="images/icon-cross.svg" class="field__icon field__icon--cross">
        </a>
  </div> `;
  }else{
    html = `<div class="field" draggable="true">
    <input type="checkbox" name="task" data-index="${(index)}" id="data-${(index+1)}"  class="field__checkbox--input">
    <label for="data-${(index+1)}" class="field__label">
      <span class="field__checked--checkbox">
        <img src="images/icon-check.svg" alt="" class="field__icon field__icon--check-checked">
      </span>
    </label>
    <div class="field__content field__content--checked">
    ${taskName}
    </div>
    <a href="#" class="cross">
    <img src="images/icon-cross.svg" class="field__icon field__icon--cross">
  </a>
  </div> `;
  }

  containerList.insertAdjacentHTML('afterbegin', html);
}

function updateLeftItems(){
  itemLeft.innerHTML = tasks.filter( (ele) => ele.status ===0 ).reduce( (curr, ele) => curr +1 , 0);
}

function deleteTask(index){
  tasks.splice(index, 1);

  showAllTasks();
  updateLeftItems();
}

function setLocalStorage(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getLocalStorage(){
  const data = JSON.parse(localStorage.getItem("tasks"));
  if(!data) return;
  tasks = data;
}

function reset(){
  localStorage.removeItem("tasks");
}

// window.addEventListener("beforeunload", function(e){
//   setLocalStorage();
//   e.preventDefault(); //per the standard
//   e.returnValue = ''; //required for Chrome
// });

/////////////////
// Add a task
inputTask.addEventListener("keyup", function(e) {
  if(e.keyCode === 13){
    const name = inputTask.value.trim();
    inputTask.value ="";

    tasks.push({
      name, status: 0
    })

    showTask(name, tasks.length-1);
    updateLeftItems();
  }
});

////////////////////////////////////////////
/// show completed

buttonCompleted.addEventListener("click", function(){
  containerList.innerHTML ="";

  removeActiveFromAll();
  this.classList.add("active");

  tasks.forEach(function(item, index){
    if(item.status === 1){
      showTask(item.name, index);
    }
  });

});

buttonAll.addEventListener("click", function(){
  // removeActiveFromAll();
  // this.classList.add("active");

  showAllTasks();
});

buttonActive.addEventListener("click", function(){
  containerList.innerHTML ="";
  removeActiveFromAll();
  this.classList.add("active");

  tasks.forEach(function(item, index){
    if(item.status === 0){
      showTask(item.name, index);
    }
  });

});

buttonClearCompleted.addEventListener("click", function(){
  
  const idx = tasks.map((ele, index) => ele.status === 1? index : -1);
  idx.reverse();
  idx.forEach(function(pos){
    if(pos > -1){
      deleteTask(pos);
    }
  });
  showAllTasks();
});


containerList.addEventListener("click", function(e){
  if(!e.target.classList.contains('field__icon--cross')){
    return;
  }

  const taskIndex = e.target.closest(".field").children[0].dataset.index;
  deleteTask(taskIndex);
});

containerList.addEventListener("change", function(e){
  const taskIndex = e.target.closest(".field").children[0].dataset.index;
  tasks[taskIndex].status = tasks[taskIndex].status === 1 ? 0 : 1;
  updateLeftItems();
  showAllTasks();
});

/////////////////////////////////////////
//STArTER
function init(){
  getLocalStorage();
  if(tasks.length > 0){  
    showAllTasks();
    updateLeftItems();
  }
}

init();





/////////////////////////////////////////////
// Drag and drop code

let dragSrcEl="";
containerList.addEventListener('dragstart', handleDragStart);
containerList.addEventListener('dragover', handleDragOver);
containerList.addEventListener('drop', handleDrop);


function handleDragOver(e){
  e.preventDefault();

  // if(typeof e.target.closest(".field") === 'undefined') return;

  // const ele = e.target.closest(".field");
  // ele.dataTransfer.dropEffect = "move";

  try{
    const ele = e.target.closest(".field");
  ele.dataTransfer.dropEffect = "move";
  }catch(e){
    return;
  }
}

function handleDrop(e) {
  e.preventDefault();

  if(!e.target.closest(".field")) return;

  const ele = e.target.closest(".field");

  if (dragSrcEl != ele) {
    let draggedText = dragSrcEl.innerHTML;
    let draggedSrcIdx = dragSrcEl.children[0].dataset.index;
    let finalSrcIdx = ele.children[0].dataset.index;
    dragSrcEl.innerHTML = ele.innerHTML;
    ele.innerHTML = draggedText; 

    swapArrayElement(draggedSrcIdx, finalSrcIdx);
  }
}

function handleDragStart(e) {


  if(!e.target.closest(".field")) return;

  const ele = e.target.closest(".field");
  dragSrcEl = ele;
}

