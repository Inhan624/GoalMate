// html의 요소 불러오기
const goalAdd = document.getElementById("goalAdd");
const goalModal = document.getElementById("goalModal");
const closeModal = document.getElementById("closeModal"); // 닫기 버튼 추가
const modalTitle = document.getElementById("modalTitle"); // 모달 제목 변경용

const saveGoal = document.getElementById("saveGoal");
const goalName = document.getElementById("goalName");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const goalContainer = document.getElementById("goalContainer");

const subGoalInput = document.getElementById("subGoalInput");
const addSubGoal = document.getElementById("addSubGoal");
const subGoalList = document.getElementById("subGoalList");

// 세부 목표들을 저장할 배열
let subGoals = [];
// 현재 수정 중인 목표의 인덱스 저장 (null이면 추가 모드, 숫자면 수정 모드)
let editIndex = null; 

// 카드 생성 함수 (수정/삭제를 위해 index 매개변수 추가)
function createGoalCard(goal, index) {
    const card = document.createElement("div");
    card.classList.add("goal-card");

    let subGoalHTML = "";
    goal.todos.forEach(todo => {
        subGoalHTML += `<li>${todo}</li>`;
    });

    // card 구성 (수정, 삭제 버튼 추가)
    card.innerHTML = `
        <h3>${goal.name}</h3>
        <p>${goal.start} ~ ${goal.end}</p>

        <h4>세부 목표</h4>
        <ul>
            ${subGoalHTML}
        </ul>
        <div class="card-buttons">
            <button onclick="openEditModal(${index})" style="margin-right: 5px;">수정</button>
            <button class="cancelBtn" onclick="deleteGoal(${index})">삭제</button>
        </div>
    `;

    goalContainer.appendChild(card);
}

// 화면 새로고침 함수 (전체 리스트를 다시 그릴 때 사용)
function renderGoals() {
    goalContainer.innerHTML = "";
    const savedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    savedGoals.forEach((goal, index) => {
        createGoalCard(goal, index);
    });
}

// 페이지가 열릴 때 저장된 목표 불러오기
renderGoals();

// 모달 초기화 함수
function clearModal() {
    goalName.value = "";
    startDate.value = "";
    endDate.value = "";
    subGoalInput.value = "";
    subGoalList.innerHTML = "";
    subGoals = [];
    editIndex = null;
    modalTitle.textContent = "새 목표 추가";
    saveGoal.textContent = "추가";
}

// 목표 추가 버튼 클릭 (추가 모드로 열기)
goalAdd.addEventListener("click", () => {
    clearModal();
    goalModal.style.display = "flex";
});

// 모달 닫기 버튼 클릭 (X 버튼 및 외부 클릭 시 닫기)
closeModal.addEventListener("click", () => {
    goalModal.style.display = "none";
});
window.addEventListener("click", (e) => {
    if (e.target === goalModal) {
        goalModal.style.display = "none";
    }
});

// 세부 목표 추가 버튼 클릭
addSubGoal.addEventListener("click", () => {
    if (subGoalInput.value.trim() === "") return;

    subGoals.push(subGoalInput.value);

    const li = document.createElement("li");
    li.textContent = subGoalInput.value;
    subGoalList.appendChild(li);

    subGoalInput.value = "";
});

// [수정] 버튼 눌렀을 때 실행되는 함수 (전역 함수로 등록)
window.openEditModal = function(index) {
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const targetGoal = goals[index];

    editIndex = index; // 현재 수정 중인 인덱스 기록
    modalTitle.textContent = "목표 수정하기";
    saveGoal.textContent = "수정 완료";

    // 기존 데이터 폼에 채우기
    goalName.value = targetGoal.name;
    startDate.value = targetGoal.start;
    endDate.value = targetGoal.end;
    
    // 세부 목표 배열 복사 및 화면 표시
    subGoals = [...targetGoal.todos];
    subGoalList.innerHTML = "";
    subGoals.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = todo;
        subGoalList.appendChild(li);
    });

    goalModal.style.display = "flex";
};

// [삭제] 버튼 눌렀을 때 실행되는 함수 (전역 함수로 등록)
window.deleteGoal = function(index) {
    if (confirm("정말로 이 목표를 삭제하시겠습니까?")) {
        let goals = JSON.parse(localStorage.getItem("goals")) || [];
        goals.splice(index, 1); // 해당 인덱스 데이터 삭제
        localStorage.setItem("goals", JSON.stringify(goals));
        renderGoals(); // 화면 갱신
    }
};

// 저장(추가/수정 완료) 버튼 클릭
saveGoal.addEventListener("click", () => {
    if (goalName.value.trim() === "") {
        alert("목표 이름을 입력해주세요.");
        return;
    }

    const goal = {
        name: goalName.value,
        start: startDate.value,
        end: endDate.value,
        todos: [...subGoals]
    };

    let goals = JSON.parse(localStorage.getItem("goals")) || [];

    if (editIndex === null) {
        // 1. 추가 모드일 때
        goals.push(goal);
    } else {
        // 2. 수정 모드일 때
        goals[editIndex] = goal;
    }

    // localStorage에 저장 후 화면 갱신
    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();

    // 모달 닫기 및 초기화
    goalModal.style.display = "none";
    clearModal();
});