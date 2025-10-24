import { checkListState, toggleFinished, updateStats, createTodoItem, clearList } from "./lib/todo.js";

/* TODO import á allt viðeigandi úr ./lib/todo.js */
/**
 * @param {HTMLElement} todolist
 */
function initialize(todolist) {
  const form = todolist.querySelector('.form')

  if (!form) {
    console.error('form fannst ekki, hætti')
    return;
  }

  console.log(form)

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const input = todolist.querySelector('input')

    if (!input) {
      console.error('input fannst ekki');
      return;
    }
    const value = input.value;

    // TODO staðfesta að value er OK

    createTodoItem(todolist, value);
    updateStats(todolist);
    
  })

  checkListState(todolist);
  

  
  
  
  /* TODO setja submit event handler á form */
  /* TODO finna gildi textareits í formi innan event handlers og búa til todo item útfrá því */
  /* TODO tengja „Fela kláruð atriði“ og „Hreinsa lista“ takka */
  const hideFinishedBtn = document.getElementById("hide-finished-btn");
  const deleteAllBtn = document.getElementById("delete-all-btn");

  hideFinishedBtn.onclick = function () {
    if (hideFinishedBtn.textContent === "Fela kláruð atriði") {
      toggleFinished(todolist);
      hideFinishedBtn.textContent = "Sýna kláruð atriði";
    } else {
      toggleFinished(todolist);
      hideFinishedBtn.textContent = "Fela kláruð atriði";
  }
  }
  deleteAllBtn.onclick = function () {
    window.confirm("Ertu viss um að þú viljir eyða öllum atriðum?");
    clearList(todolist);
    updateStats(todolist);
    checkListState(todolist);
  }



}


// Finnum todo lista og keyrum fall sem setur allt upp
const todoList = document.querySelector(".todo-list");

// Viljum vera viss um að todoList hafi fundist og sé HTMLElement
if (todoList && todoList instanceof HTMLElement) {
  initialize(todoList);
} else {
  console.error("no todo list found");
}
