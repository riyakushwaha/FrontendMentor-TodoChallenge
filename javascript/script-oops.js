'use strict';
//////////////////////////////////////////////////////////////////////////
//----------------------Same Code implemented as Class-----------------///

////////////////////////////////////////////Change themes
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

////////////////////////////////////////////Functionality of Application

const inputTask = document.querySelector(".field__content--input");
const containerList = document.querySelector(".list");
const buttonAll = document.querySelector(".items__tab--1");
const buttonActive = document.querySelector(".items__tab--2");
const buttonCompleted = document.querySelector(".items__tab--3");
const buttonClearCompleted = document.querySelector(".items__delete");
const itemLeft = document.querySelector(".left");
const buttonTabs = document.querySelectorAll(".btn--tab");

class TodoApp{
    tasks = [
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
    
    dragSrcEl = "";

    constructor(){
        //event-listeners
        inputTask.addEventListener("keyup", this.addNewTask.bind(this));
        buttonCompleted.addEventListener("click", this.showCompletedTasks.bind(this));
        buttonAll.addEventListener("click", this.showAllTasks.bind(this));
        buttonActive.addEventListener("click", this.showActiveTasks.bind(this));
        buttonClearCompleted.addEventListener("click", this.deleteCompletedTasks.bind(this));
        containerList.addEventListener("click", this.deleteCrossClickedTask.bind(this));
        containerList.addEventListener("change", this.changeTaskStatus.bind(this));
        // window.addEventListener("beforeunload", this.storeTasksInStorage.bind(this));

        // drag and drop functionality event listeners
        containerList.addEventListener('dragstart', this.handleDragStart.bind(this));
        containerList.addEventListener('dragover', this.handleDragOver.bind(this));
        containerList.addEventListener('drop', this.handleDrop.bind(this));

        // initial function calls
        this.getLocalStorage();
        if(this.tasks.length > 0){  
            this.renderAllTasks();
            this.updateLeftItems();
        }
    }

    showTask(taskName, index){
        let html = "";
        if(this.tasks[index].status === 0){
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

    renderAllTasks(e){
      containerList.innerHTML = "";
      this.tasks.forEach(function(item, index){
        this.showTask(item.name, index);
      }, this);
    }

    showAllTasks(e){
        containerList.innerHTML = "";
        this.removeActiveFromAll();
        buttonAll.classList.add("active");
        this.tasks.forEach(function(item, index){
          this.showTask(item.name, index);
        }, this);
    }

    showCompletedTasks(e){
        containerList.innerHTML ="";
        this.removeActiveFromAll();
        e.target.classList.add("active");
      
        this.tasks.forEach(function(item, index){
          if(item.status === 1){
            this.showTask(item.name, index);
          }
        }, this);
    }

    showActiveTasks(e){
        containerList.innerHTML ="";
        this.removeActiveFromAll();
        e.target.classList.add("active");
      
        this.tasks.forEach(function(item, index){
          if(item.status === 0){
            this.showTask(item.name, index);
          }
        }, this);
    }

    deleteCompletedTasks(){
        const idx = this.tasks.map((ele, index) => ele.status === 1? index : -1);
        idx.reverse();
        idx.forEach(function(pos){
          if(pos > -1){
            this.deleteTask(pos);
          }
        }, this);
        this.showAllTasks();
    }

    deleteCrossClickedTask(e){
        if(!e.target.classList.contains('field__icon--cross')){
            return;
          }
        
          const taskIndex = e.target.closest(".field").children[0].dataset.index;
          this.deleteTask(taskIndex);
    }

    changeTaskStatus(e){
        try{
        const taskIndex = e.target.closest(".field").children[0].dataset.index;
        this.tasks[taskIndex].status = this.tasks[taskIndex].status === 1 ? 0 : 1;
        this.updateLeftItems();
        this.renderAllTasks()
        }catch(err){
            console.error(err);
        }
    }

    deleteTask(index){
        this.tasks.splice(index, 1);
        this.showAllTasks();
        this.updateLeftItems();
    }

    updateLeftItems(){
        itemLeft.innerHTML = this.tasks.filter( (ele) => ele.status ===0 ).reduce( (curr, ele) => curr +1 , 0);
    }

    swapArrayElement(src, dest){
       const temp = this.tasks[src];
       this.tasks[src] = this.tasks[dest];
       this.tasks[dest] = temp;
    }

    removeActiveFromAll(){
       buttonTabs.forEach(function(btn){
       btn.classList.remove("active");
       });
    }

    addNewTask(e){
        if(e.keyCode === 13){
            const name = inputTask.value.trim();
            inputTask.value ="";
        
            this.tasks.push({
              name, status: 0
            })
        
            this.showTask(name, this.tasks.length-1);
            this.updateLeftItems();
          }
    }

    storeTasksInStorage(e){
        this.setLocalStorage();
        e.preventDefault(); //per the standard
        e.returnValue = ''; //required for Chrome
    }

    //Storage Functions
    setLocalStorage(){
       localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
      
    getLocalStorage(){
       const data = JSON.parse(localStorage.getItem("tasks"));
       if(!data) return;
       this.tasks = data;
    }
      
    reset(){
       localStorage.removeItem("tasks");
    }

    handleDragOver(e){
        e.preventDefault();
        try{
            const ele = e.target.closest(".field");
            ele.dataTransfer.dropEffect = "move";
        }catch(e){
          return;
        }
    }
      
    handleDrop(e){
       e.preventDefault();
       if(!e.target.closest(".field")) return;

       const ele = e.target.closest(".field");
       if (this.dragSrcEl != ele) {
        let draggedText = this.dragSrcEl.innerHTML;
        let draggedSrcIdx = this.dragSrcEl.children[0].dataset.index;
        let finalSrcIdx = ele.children[0].dataset.index;
        this.dragSrcEl.innerHTML = ele.innerHTML;
        ele.innerHTML = draggedText; 
        this.swapArrayElement(draggedSrcIdx, finalSrcIdx);
        }
    }
      
    handleDragStart(e){
       if(!e.target.closest(".field")) return;

       const ele = e.target.closest(".field");
       this.dragSrcEl = ele;
    }
}


const app = new TodoApp();