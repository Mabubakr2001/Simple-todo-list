const inputAddTodo = document.querySelector(".input-add-todo");
const btnAddTodo = document.querySelector(".btn-add-todo");
const sortBySelect = document.querySelector(".sort-by");
const todoList = document.querySelector(".todo-list");
const finishTodoBtn = document.querySelector(".btn-done");
const deleteTodoBtn = document.querySelector(".btn-delete");
let allTodosArr = [];

function createTodo(fromLocalStorage = false, todoName, todoState) {
  if (todoName === "") return;
  const todoElement = `
    <div class="todo" data-state="${todoState}" data-visibility="visible">
        <p class="todo-name">${todoName}</p>
        <button class="btn-done">
            <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none">
                <path
                d="M20 7.00018L10 17.0002L5 12.0002"
                stroke="#fff"
                stroke-width="2.5"
                stroke-linecap="round"
                    stroke-linejoin="round"
                    />
            </svg>
        </button>
        <button class="btn-delete">
            <svg fill="#fff" width="32px" height="32px" viewBox="0 0 24 24">
                <path
                d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"
                />
            </svg>
        </button>
    </div>
  `;

  if (!fromLocalStorage) {
    allTodosArr.push({
      name: todoName,
      state: todoState,
    });
    interactWithLocalStorage("set");
  }

  todoList.insertAdjacentHTML("beforeend", todoElement);
}

function finishTodo(clickedSpot) {
  const targetTodoElement = clickedSpot.closest(".todo");
  if (targetTodoElement == null) return;
  targetTodoElement.dataset.state = "completed";
  const theNameForCurrentTodo = targetTodoElement.querySelector(".todo-name");
  const correspondingObject = allTodosArr.find(
    (todo) => todo.name === theNameForCurrentTodo.textContent
  );
  correspondingObject.state = targetTodoElement.dataset.state;
  interactWithLocalStorage("set");
}

function deleteTodo(clickedSpot) {
  const targetTodoElement = clickedSpot.closest(".todo");
  if (targetTodoElement == null) return;
  targetTodoElement.style.animation = "slideOut 1s ease-in-out";
  const theNameForCurrentTodo = targetTodoElement.querySelector(".todo-name");
  const correspondingObject = allTodosArr.findIndex(
    (todo) => todo.name === theNameForCurrentTodo.textContent
  );
  if (correspondingObject === -1) return;
  allTodosArr.splice(correspondingObject, 1);
  targetTodoElement.addEventListener("animationend", () =>
    targetTodoElement.remove()
  );
  if (allTodosArr.length === 0) {
    localStorage.clear();
    return;
  }
  interactWithLocalStorage("set");
}

function sortTodos(sortMethod) {
  const allCreatedTodos = todoList.querySelectorAll(".todo");
  allCreatedTodos.forEach((todo) => {
    switch (sortMethod) {
      case "all":
        todo.dataset.visibility = "visible";
        break;
      case "completed":
        todo.dataset.state === "completed"
          ? (todo.dataset.visibility = "visible")
          : (todo.dataset.visibility = "hidden");
        break;
      case "uncompleted":
        todo.dataset.state === "uncompleted"
          ? (todo.dataset.visibility = "visible")
          : (todo.dataset.visibility = "hidden");
        break;
    }
  });
}

function interactWithLocalStorage(interactMethod) {
  const interactMethodLower = interactMethod.toLowerCase();
  if (interactMethodLower === "set")
    return localStorage.setItem("allTodos", JSON.stringify(allTodosArr));
  if (interactMethodLower === "get")
    return JSON.parse(localStorage.getItem("allTodos"));
}

btnAddTodo.addEventListener("click", () => {
  createTodo(false, inputAddTodo.value, "uncompleted");
  inputAddTodo.value = "";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    createTodo(false, inputAddTodo.value, "uncompleted");
    inputAddTodo.value = "";
  }
});

todoList.addEventListener("click", (event) => {
  const clickedSpot = event.target;
  if (clickedSpot.classList.contains("btn-done")) finishTodo(clickedSpot);
  if (clickedSpot.classList.contains("btn-delete")) deleteTodo(clickedSpot);
});

sortBySelect.addEventListener("change", (event) =>
  sortTodos(event.target.value)
);

window.addEventListener("load", () => {
  const localStorageCreatedTodos = interactWithLocalStorage("get");
  if (localStorageCreatedTodos == null) return;
  allTodosArr = localStorageCreatedTodos;
  localStorageCreatedTodos.forEach((todo) =>
    createTodo(true, todo.name, todo.state)
  );
});
