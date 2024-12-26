const changeAccount = document.querySelector(".account");
if (localStorage.getItem("userName")) {
  changeAccount.innerHTML = `
  <a href="../profile/profile.html" class="icon-link">
    <i class="fa fa-user"></i>
    <span>${localStorage.getItem("userName")}</span>
  </a>
`;
}
