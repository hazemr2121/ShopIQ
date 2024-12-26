const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailMassage = document.getElementById("emailMassage");
// const passwordMassage = document.getElementById("passwordMassage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const enteredEmail = emailInput.value.trim();
  const enteredPassword = passwordInput.value;
});
