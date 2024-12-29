const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailMassage = document.getElementById("emailMassage");
// const passwordMassage = document.getElementById("passwordMassage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const enteredEmail = emailInput.value.trim();
  const enteredPassword = passwordInput.value;
  fetch("http://localhost:3000/api/userByEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: enteredEmail }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.massage !== "User not found") {
        localStorage.setItem("userId", data._id);
        localStorage.setItem("userName", data.username);
        localStorage.setItem("address", data.address);
        localStorage.setItem("phone", data.phone);
        localStorage.setItem("orders", JSON.stringify(data.orders));
        localStorage.setItem("wishList", JSON.stringify(data.wishlist));
        localStorage.setItem("email", data.email);
        const formatDateToReadable = (isoString) => {
          const options = { year: "numeric", month: "long", day: "numeric" };
          return new Date(isoString).toLocaleDateString(undefined, options);
        };
        const createdAt = formatDateToReadable(data.createdAt);
        localStorage.setItem("createdAt", createdAt);
        location.href = "/ui/home.html";
        localStorage.setItem("loginMassage", "login success");
      } else {
        emailMassage.textContent = "User not found! Please check your email.";
        emailMassage.classList.add("active");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // emailMassage.classList.add("active");
    });
});
