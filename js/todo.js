const goalSelect = document.getElementById("goalSelect");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const todoModal = document.getElementById("todoModal");
const todoInput = document.getElementById("todoInput");
const saveTodo = document.getElementById("saveTodo");
const todoContainer = document.getElementById("todoContainer");

// 저장된 목표 가져와서 select에 추가
const goals = JSON.parse(localStorage.getItem("goals")) || [];

goals.forEach(goal => {
    const option = document.createElement("option");
    option.value = goal.name;
    option.textContent = goal.name;
    goalSelect.appendChild(option);
});

// 모달 열기
openModalBtn.addEventListener("click", () => {
    todoModal.style.display = "flex";
});

// 모달 닫기
closeModalBtn.addEventListener("click", () => {
    todoModal.style.display = "none";
});

// To Do 카드 생성 함수
function createTodoCard(todo) {
    const card = document.createElement("div");
    card.classList.add("todo-card");

    card.innerHTML = `
        <span class="importance">${todo.importance}</span>
        <span class="todo-text">${todo.text}</span>
        <span class="todo-goal">${todo.goal ? "🎯 " + todo.goal : ""}</span>
        <button class="doneBtn">완료</button>
    `;

    // 완료 버튼 클릭 시 카드 삭제
    card.querySelector(".doneBtn").addEventListener("click", () => {
        card.remove();

        // localStorage에서도 삭제
        let todos = JSON.parse(localStorage.getItem("todos")) || [];
        todos = todos.filter(t => !(t.text === todo.text && t.goal === todo.goal));
        localStorage.setItem("todos", JSON.stringify(todos));
    });

    todoContainer.appendChild(card);
}

// 페이지 열릴 때 저장된 To Do 불러오기
const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
savedTodos.forEach(todo => createTodoCard(todo));

// 추가 버튼 클릭
saveTodo.addEventListener("click", () => {
    if (todoInput.value.trim() === "") return;

    const todo = {
        text: todoInput.value.trim(),
        goal: goalSelect.value,
        importance: document.getElementById("importance").value
    };

    // localStorage에 저장
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));

    // 화면에 카드 추가
    createTodoCard(todo);

    // 입력값 초기화 및 모달 닫기
    todoInput.value = "";
    goalSelect.value = "";
    document.getElementById("importance").value = "🔴";
    todoModal.style.display = "none";
});