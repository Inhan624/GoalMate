// html의 요소 불러오기
const goalAdd = document.getElementById("goalAdd");
const goalModal = document.getElementById("goalModal");

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

// 카드 생성 함수
function createGoalCard(goal) {
    const card = document.createElement("div"); // 새 div 만들기
    card.classList.add("goal-card");

    let subGoalHTML = "";

    // subGoalHTML에 세부 목표 li로 넣기
    goal.todos.forEach(todo => {
        subGoalHTML += `<li>${todo}</li>`; // 반복
    });

    // card 구성
    card.innerHTML = `
        <h3>${goal.name}</h3>
        <p>${goal.start} ~ ${goal.end}</p>

        <h4>세부 목표</h4>
        <ul>
            ${subGoalHTML}
        </ul>
    `;

    // card를 goalContainer 안에 추가하기
    goalContainer.appendChild(card);
}


// 페이지가 열릴 때 저장된 목표 불러오기
const savedGoals = JSON.parse(localStorage.getItem("goals")) || [];

savedGoals.forEach(goal => {
    createGoalCard(goal);
});


// 목표 추가 버튼 클릭
goalAdd.addEventListener("click", () => {
    goalModal.style.display = "flex";
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


// 저장 버튼 클릭
saveGoal.addEventListener("click", () => {

    const goal = {
        name: goalName.value,
        start: startDate.value,
        end: endDate.value,
        todos: [...subGoals]
    };

    // 기존 목표 가져오기
    let goals = JSON.parse(localStorage.getItem("goals")) || [];

    // 새 목표 추가
    goals.push(goal);

    // localStorage에 저장
    localStorage.setItem("goals", JSON.stringify(goals));

    // 화면에 카드 추가
    createGoalCard(goal);

    // 입력값 초기화
    goalName.value = "";
    startDate.value = "";
    endDate.value = "";
    subGoalInput.value = "";
    subGoalList.innerHTML = "";
    subGoals = [];

    // 모달 닫기
    goalModal.style.display = "none";
});