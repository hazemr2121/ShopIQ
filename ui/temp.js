const changeAccount = document.querySelector(".account");
if (localStorage.getItem("userName")) {
  changeAccount.innerHTML = `
  <a href="../profile/profile.html" class="icon-link">
    <i class="fa fa-user"></i>
    <span>${localStorage.getItem("userName")}</span>
  </a>
`;
}
if (localStorage.getItem("loginMassage")) {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: localStorage.getItem("loginMassage"),
    showConfirmButton: false,
    timer: 1500,
    width: "150px", // Set a smaller width
    customClass: {
      popup: "minimized-swal", // Add a custom class if more customization is needed
    },
    backdrop: false, // Optional: Remove the overlay background
  });
}
setTimeout(() => {
  localStorage.removeItem("loginMassage");
}, 2000);
