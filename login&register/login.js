const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailMassage = document.getElementById("emailMassage");
// const passwordMassage = document.getElementById("passwordMassage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const enteredEmail = emailInput.value.trim();
  const enteredPassword = passwordInput.value;
  fetch(`http://localhost:3000/api/userByEmail/${enteredEmail}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (!data.message) {
        const userData = {
          userId: data._id,
          userName: data.username,
          address: data.address,
          phone: data.phone,
          orders: data.orders,
          role: data.role,
          wishList: data.wishlist,
          email: data.email,
          cart: data.cart,
          createdAt: new Date(data.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        };
        localStorage.setItem("user", JSON.stringify(userData));
        location.href = "/ui/home.html";
        localStorage.setItem("loginMassage", "login success");
      } else {
        emailMassage.textContent = "User not found! Please check your email.";
        emailMassage.classList.add("active");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      emailMassage.classList.add("active");
    });
});
