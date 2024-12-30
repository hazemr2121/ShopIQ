// console.log(localStorage.getItem("user"));

if (!localStorage.getItem("user")) {
  location.href = "http://127.0.0.1:5501/login&register/login.html";
}
