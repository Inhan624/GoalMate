// HTML 요소들을 가져와 변수에 저장
const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");
const selectedDateTitle = document.getElementById("selectedDateTitle");
const selectedTodoList = document.getElementById("selectedTodoList");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

// 현재 날짜 객체 생성
const today = new Date();

// 현재 보고 있는 연도 저장
let viewYear = today.getFullYear();

// 현재 보고 있는 월 저장(0~11)
let viewMonth = today.getMonth();

// 현재 선택된 날짜를 "yyyy-mm-dd" 형태로 저장
let selectedDate = formatDate(today);

// localStorage에 저장된 할 일 목록 가져오기
function getSavedTodos() {
  // JSON 변환 과정에서 오류가 날 수 있으므로 try 사용
  try {
    // localStorage에서 todos를 가져오고 JSON을 객체로 변환
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    // 배열이면 반환하고 아니면 빈 배열 반환
    return Array.isArray(todos) ? todos : [];
  } catch (error) {
    // 오류가 발생하면 빈 배열 반환
    return [];
  }
}

// 할 일 목록을 localStorage에 저장
function saveTodos(todos) {
  // 배열을 문자열(JSON)로 변환해서 저장
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Date 객체를 yyyy-mm-dd 형태로 변환
function formatDate(date) {
  // 연도 추출
  const year = date.getFullYear();

  // 월 추출 후 두 자리로 맞춤
  const month = String(date.getMonth() + 1).padStart(2, "0");

  // 일 추출 후 두 자리로 맞춤
  const day = String(date.getDate()).padStart(2, "0");

  // yyyy-mm-dd 형식으로 반환
  return `${year}-${month}-${day}`;
}

// yyyy-mm-dd를 "6월 16일" 형태로 변환
function formatKoreanDate(dateText) {
  // 연도는 버리고 월, 일을 분리
  const [, month, day] = dateText.split("-");

  // 숫자로 바꿔서 반환
  return `${Number(month)}월 ${Number(day)}일`;
}

// todo 객체 안의 날짜를 가져옴
function getTodoDate(todo) {
  // date가 있으면 사용하고 없으면 dueDate 사용
  // 그것도 없으면 todoDate 사용
  return todo.date || todo.dueDate || todo.todoDate || "";
}

// 특정 날짜에 해당하는 todo인지 판단
function todoMatchesDate(todo, dateText) {
  // todo의 날짜 가져오기
  const todoDate = getTodoDate(todo);

  // 매일 반복이면 무조건 표시
  if (todo.isDaily) {
    return true;
  }

  // 날짜 정보가 존재한다면
  if (todoDate) {
    // 선택한 날짜와 같을 때만 true
    return todoDate === dateText;
  }

  // 날짜 정보가 없는 경우 오늘 날짜에서만 표시
  return dateText === formatDate(today);
}

// 특정 날짜의 todo들만 가져옴
function getTodosForDate(dateText) {
  // 저장된 todo 중에서 날짜가 맞는 것만 필터링
  return getSavedTodos().filter((todo) => todoMatchesDate(todo, dateText));
}

// 달력을 그리는 함수
function renderCalendar() {
  // 현재 월 표시
  calendarTitle.textContent = `${viewMonth + 1}월`;

  // 기존 달력 비우기
  calendarGrid.innerHTML = "";

  // 이번 달 1일의 요일 구하기
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  // 이번 달 마지막 날짜 구하기
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

  // 달력 칸 개수 계산
  const cellCount = Math.ceil((firstDay + lastDate) / 7) * 7;

  // 칸 개수만큼 반복
  for (let index = 0; index < cellCount; index += 1) {
    // 버튼 생성
    const cell = document.createElement("button");

    // type 지정
    cell.type = "button";

    // 클래스 추가
    cell.classList.add("calendar-cell");

    // 실제 날짜 계산
    const day = index - firstDay + 1;

    // 이전 달 또는 다음 달 영역이면
    if (day < 1 || day > lastDate) {
      // 빈 칸 처리
      cell.classList.add("empty");

      // 클릭 불가능하게 설정
      cell.disabled = true;

      // 달력에 추가
      calendarGrid.appendChild(cell);

      continue;
    }

    // 현재 날짜 문자열 생성
    const dateText = formatDate(new Date(viewYear, viewMonth, day));

    // 해당 날짜의 할 일 가져오기
    const dateTodos = getTodosForDate(dateText);

    // 선택된 날짜라면 selected 클래스 추가
    if (dateText === selectedDate) {
      cell.classList.add("selected");
    }

    // 날짜 숫자 span 생성
    const dayNumber = document.createElement("span");

    // 클래스 추가
    dayNumber.classList.add("day-number");

    // "16일" 같은 텍스트 넣기
    dayNumber.textContent = `${day}일`;

    // 버튼 안에 추가
    cell.appendChild(dayNumber);

    // 할 일이 존재하면
    if (dateTodos.length > 0) {
      // 점들을 담을 div 생성
      const dots = document.createElement("div");

      // 클래스 추가
      dots.classList.add("todo-dots");

      // 최대 3개까지만 반복
      dateTodos.slice(0, 3).forEach(() => {
        // 점 생성
        const dot = document.createElement("span");

        // 클래스 추가
        dot.classList.add("todo-dot");

        // div에 추가
        dots.appendChild(dot);
      });

      // 버튼 안에 추가
      cell.appendChild(dots);
    }

    // 날짜 클릭 이벤트 등록
    cell.addEventListener("click", () => {
      // 선택된 날짜 변경
      selectedDate = dateText;

      // 달력 다시 그림
      renderCalendar();

      // 아래 todo 목록 다시 그림
      renderSelectedDate();
    });

    // 버튼을 달력에 추가
    calendarGrid.appendChild(cell);
  }
}
