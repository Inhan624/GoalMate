// =========================
// 요소 가져오기
// =========================
const modalTitle = document.getElementById("modalTitle");
const editTodoId = document.getElementById("editTodoId");
const goalSelect = document.getElementById("goalSelect");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const todoModal = document.getElementById("todoModal");
const todoInput = document.getElementById("todoInput");
const saveTodo = document.getElementById("saveTodo");
const todoContainer = document.getElementById("todoContainer");
const isDailyInput = document.getElementById("isDailyInput");
const todayDate = document.getElementById("todayDate");

// =========================
// 날짜
// =========================

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatKoreanDate(dateText) {
  const [, month, day] = dateText.split("-");

  return `${Number(month)}월 ${Number(day)}일`;
}

const currentDateText = formatDate(new Date());

if (todayDate) {
  todayDate.textContent = formatKoreanDate(currentDateText);
}

function getTodoDate(todo) {
  if (todo.date || todo.dueDate || todo.todoDate) {
    return todo.date || todo.dueDate || todo.todoDate;
  }

  if (typeof todo.id === "number") {
    const dateFromId = new Date(todo.id);

    if (!Number.isNaN(dateFromId.getTime())) {
      return formatDate(dateFromId);
    }
  }

  return "";
}

function shouldShowOnToday(todo) {
  if (todo.isDaily) {
    const todoDate = getTodoDate(todo);

    return !todoDate || todoDate <= currentDateText;
  }

  return getTodoDate(todo) === currentDateText;
}

function getTodayTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos.filter((todo) => shouldShowOnToday(todo));
}

// =========================
// 목표 불러오기
// =========================

const goals = JSON.parse(localStorage.getItem("goals")) || [];

goals.forEach((goal) => {
  const option = document.createElement("option");

  option.value = goal.name;
  option.textContent = goal.name;

  goalSelect.appendChild(option);
});

// =========================
// 모달
// =========================

openModalBtn.addEventListener("click", () => {
  todoModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
  todoModal.style.display = "none";
});

// =========================
// 달성률 계산
// =========================

function updateProgress() {
  const todos = getTodayTodos();

  const progressText = document.getElementById("progressText");

  if (!progressText) return;

  if (todos.length === 0) {
    progressText.textContent = "0%";
    return;
  }

  const doneCount = todos.filter((todo) => todo.done).length;

  const percent = Math.round((doneCount / todos.length) * 100);

  progressText.textContent = `${percent}%`;
}

// =========================
// 카드 생성
// =========================

function createTodoCard(todo) {
  const card = document.createElement("div");

  card.classList.add("todo-card");

  card.innerHTML = `
    <div class="todo-item">

      <input
        type="checkbox"
        class="doneCheck"
        ${todo.done ? "checked" : ""}
      >

      <span class="importance">
        ${todo.importance === "none" ? "" : todo.importance}
				
      </span>

      <span class="todo-text ${todo.done ? "completed" : ""}">
        ${todo.text}
      </span>

      <button class="editBtn">
        수정
      </button>

    </div>
  `;
  // 없음 선택했을때 아예 중요도 표시를 하지 않음

  // =========================
  // 체크박스
  // =========================

  card.querySelector(".doneCheck").addEventListener("change", (e) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    const target = todos.find((t) => t.id === todo.id);

    if (target) {
      target.done = e.target.checked;
    }

    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodos();
  });

  // =========================
  // 수정 버튼
  // =========================

  // =========================
  // 수정 버튼
  // =========================

  card.querySelector(".editBtn").addEventListener("click", () => {
    // 수정할 Todo id 저장
    editTodoId.value = todo.id;

    // 기존 값 넣기
    todoInput.value = todo.text;

    goalSelect.value = todo.goal;

    document.getElementById("importance").value = todo.importance;

    isDailyInput.checked = Boolean(todo.isDaily);

    // 제목 변경
    modalTitle.textContent = "To Do 수정";

    // 모달 열기
    todoModal.style.display = "flex";
  });

  return card;
}

// =========================
// 전체 화면 다시 그리기
// =========================

function renderTodos() {
  todoContainer.innerHTML = "";

  const todos = getTodayTodos();

  if (todos.length === 0) {
    const empty = document.createElement("p");

    empty.classList.add("empty-message");
    empty.textContent = "오늘 등록된 할 일이 없습니다.";

    todoContainer.appendChild(empty);

    updateProgress();

    return;
  }

  const groups = {};

  // 목표별 그룹화
  todos.forEach((todo) => {
    const goalName = todo.goal || "목표 없음";

    if (!groups[goalName]) {
      groups[goalName] = [];
    }

    groups[goalName].push(todo);
  });

  Object.keys(groups).forEach((goalName) => {
    const group = document.createElement("div");

    group.classList.add("goal-group");

    group.innerHTML = `
      <h3 class="goal-title">
        ${goalName}
      </h3>
    `;

    // 완료 안한 것 먼저
    const sortedTodos = groups[goalName].sort(
      (a, b) => Number(a.done) - Number(b.done),
    );

    sortedTodos.forEach((todo) => {
      const card = createTodoCard(todo);

      group.appendChild(card);
    });

    todoContainer.appendChild(group);
  });

  updateProgress();
}

// =========================
// Todo 추가
// =========================

saveTodo.addEventListener("click", () => {
  const text = todoInput.value.trim();

  if (!text) return;

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // 수정 모드
  if (editTodoId.value) {
    const target = todos.find((t) => String(t.id) === editTodoId.value);

    if (target) {
      target.text = text;

      target.goal = goalSelect.value;

      target.importance = document.getElementById("importance").value;

      target.isDaily = isDailyInput.checked;

      target.date = getTodoDate(target) || currentDateText;
    }
  } else {
    // 추가 모드
    todos.push({
      id: Date.now(),

      text,

      goal: goalSelect.value,

      importance: document.getElementById("importance").value,

      isDaily: isDailyInput.checked,

      date: currentDateText,

      done: false,
    });
  }

  localStorage.setItem("todos", JSON.stringify(todos));

  // 초기화
  editTodoId.value = "";

  modalTitle.textContent = "To Do 추가";

  todoInput.value = "";

  goalSelect.value = "";

  document.getElementById("importance").value = "none";

  isDailyInput.checked = false;

  todoModal.style.display = "none";

  renderTodos();
});

// =========================
// 시작
// =========================

renderTodos();
