//html 요소 가져오기
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const form = document.querySelector(".login-form");

// 입력값 확인
function checkInput() {
  if (email.value.trim() !== "" && password.value.trim() !== "") {
    loginBtn.disabled = false; // 버튼 사용 가능
  } else {
    loginBtn.disabled = true; // 버튼 사용 불가능
  }
}
// email.value (입력한 값)
// trim() 공백 제거

// addEventListener는 특정 함수를 실행시키라는 뜻!
// input은 입력했을때 일어나는 이벤트
email.addEventListener("input", checkInput);
password.addEventListener("input", checkInput);


// 로그인 버튼 클릭시 실행됨
form.addEventListener("submit", function (e) {
  e.preventDefault(); // 새로고침 방지

  if (email.value.trim() !== "" && password.value.trim() !== "") {
    window.location.href = "index.html"; //홈 화면으로 이동
  }
});