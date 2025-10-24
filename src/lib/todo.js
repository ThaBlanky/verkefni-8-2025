/* TODO hugsanlega importa el, empty úr ./elements.js */

// Leyfilegt að breyta skilgreiningum á föllum og bæta við fleiri föllum.

/* TODO merkja viðeigandi föll með `export` */

/**
 * Breytir stöðu atriðis í lista. Ef kláruð atriði eru sýnd er það sýnt, annars er það falið um leið og það er klárað.
 * @param {HTMLElement} item
 * @param {boolean} finished `true` ef atriði er klárað, annars `false`.
 * @returns {void}
 */
function toggleTodoItemStatus(item, finished = false) {
  // set or remove the finished class according to the checked state
  if (finished) {
    item.classList.add("finished");
  } else {
    item.classList.remove("finished");
  }

  // if the list has finished items hidden, hide this item immediately when it's marked finished
  const todolist = item.closest(".todo-list");
  if (todolist) {
    const finishedHidden = todolist.dataset.finished === "hidden";
    if (finished && finishedHidden) {
      item.style.display = "none";
    } else {
      // ensure it's visible when not finished or when finished items are shown
      item.style.display = "";
    }

    // update stats and empty-state
    updateStats(todolist);
    checkListState(todolist);
  }
}

/**
 * Fjarlægja atriði (sem DOM element) úr lista.
 * @param {HTMLElement} item
 * @returns {void}
 */
function removeTodoItem(item) {
  console.log("EYÐA", item);
  const spanEl = item.querySelector("span.item");

  let text = "<unknown item>";
  if (!spanEl) {
    console.warn("cannot find spanEl");
  } else {
    text = spanEl.textContent;
  }

  if (confirm(`Viltu eyða „${text}“?`)) {
    item.remove();
    // uppfæra stöðu tóma lista ef þarf
    const todolist = item.closest(".todo-list");
    if (todolist) {
      updateStats(todolist);
      checkListState(todolist);
    }
  }
}

/**
 * Breytir sýnileika kláraðra atriða í lista.
 * @param {HTMLElement} todolist
 * @return {boolean} `true` if finished items are shown, `false` if hidden
 */
export function toggleFinished(todolist) {

  if (!todolist) {
    console.warn("toggleFinished: missing todolist element");
    return true;
  }

  const list = todolist.querySelector("ul.list");
  if (!list) {
    console.warn("toggleFinished: cannot find list");
    return true;
  }

  // data-finished is either "shown" or "hidden"
  const current = todolist.dataset.finished || "shown";
  const willShow = current === "hidden"; // if currently hidden, we'll show
  todolist.dataset.finished = willShow ? "shown" : "hidden";

  const items = Array.from(list.querySelectorAll("li"));
  items.forEach((li) => {
    const checkbox = li.querySelector('input[type="checkbox"][name="finished"]');
    const isFinished = li.classList.contains("finished") || (checkbox && checkbox.checked);
    if (isFinished) {
      li.style.display = willShow ? "" : "none";
    } else {
      li.style.display = "";
    }
  });

  // show "empty" message
  checkListState(todolist);

  return willShow;
}

/**
 * Hreinsar allan lista.
 * @param {HTMLElement} todolist
 * @return {void}
 */
export function clearList(todolist) {
  /* TODO útfæra */
  todolist.querySelectorAll(".list li").forEach((item) => {
      item.remove();
    });
} 

/**
 * Uppfærir upplýsingar um fjölda kláraðra og ókláraðra atriða í lista.
 * @param {HTMLElement} todolist
 * @return {void}
 */
export function updateStats(todolist) {
  const finishedEl = todolist.querySelector(".stats .finished");
  const unfinishedEl = todolist.querySelector(".stats .unfinished");

  if (!finishedEl || !unfinishedEl) {
    console.warn("could not find finished/unfinished nodes");
    return;
  }

  const allItems = todolist.querySelectorAll(".list li");
  const allFinishedItems = todolist.querySelectorAll(".list li.finished");

  if (!allItems || !allFinishedItems) {
    return;
  }

  const finishedCount = allFinishedItems.length;
  const unfinishedCount = allItems.length - finishedCount;

  finishedEl.textContent = finishedCount.toString();
  unfinishedEl.textContent = unfinishedCount.toString();
  checkListState(todolist);
}

/**
 * Býr til nýtt atriði í lista með texta `text`.
 * @param {HTMLElement} todolist
 * @param {string} text
 * @return {void}
 */
export function createTodoItem(todolist, text) {
  
  const li = document.createElement("li");

  const button = document.createElement("button");
  button.textContent = "🗑️";
  button.addEventListener("click", () => {
    removeTodoItem(li);
    updateStats(todolist);
  });

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("name", "finished");
  input.addEventListener("change", () => {
    console.log("input", input.checked);
    // pass the actual checked state so toggleTodoItemStatus can decide visibility
    toggleTodoItemStatus(li, input.checked);
    // updateStats is also called inside toggleTodoItemStatus, but keep for clarity
    updateStats(todolist);
  });

  const span = document.createElement("span");
  span.classList.add("item");
  span.textContent = text;

  const label = document.createElement("label");

  label.appendChild(input);
  label.appendChild(span);
  li.appendChild(label);
  li.appendChild(button);

  const list = todolist.querySelector("ul.list");
  list?.appendChild(li);

  // update empty message and stats after adding
  checkListState(todolist);
}

/**
 * Athugar hvort listinn sé tómur og sýnir eða felur skilaboð um tóman lista.
 * @param {HTMLElement} todolist
 * @return {void}
 */
export function checkListState(todolist) {
  const emptyEl = todolist.querySelector(".empty");
  const list = todolist.querySelector("ul.list");
  if (!emptyEl || !list) return;

  const items = Array.from(list.querySelectorAll("li"));
  // visible if at least one li has display different from "none"
  const hasVisible = items.some((li) => {
    // computed style covers cases where display is not set inline
    return li.style.display !== "none" && getComputedStyle(li).display !== "none";
  });

  if (hasVisible) {
    emptyEl.classList.add("hidden");
  } else {
    emptyEl.classList.remove("hidden");
  }
}
