const form = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordConfirmation = document.getElementById("confirmPassword");

// ***********user name***********
const usernameMassage = document.getElementById("usernameMassage");

const usernameRegex = /^[A-Za-z][A-Za-z0-9]{2,11}$/;

usernameInput.addEventListener("focus", (event) => {
  const username = event.target.value.trim();
  if (usernameRegex.test(username)) {
    usernameMassage.classList.add("user-massge");
    usernameMassage.classList.add("success");
    usernameMassage.textContent = "validat username ";
  } else {
    usernameMassage.classList.add("user-massge");
  }
});

usernameInput.addEventListener("input", (event) => {
  const username = event.target.value.trim();
  if (usernameRegex.test(username)) {
    usernameMassage.classList.add("success");
    usernameMassage.textContent = "validat username ";
  } else {
    usernameMassage.classList.remove("success");
    usernameMassage.textContent = "Enter at least 3 characters";
  }
});
usernameInput.addEventListener("blur", (event) => {
  const username = event.target.value.trim();
  if (usernameRegex.test(username)) {
    usernameMassage.classList.remove("user-massge");
    usernameMassage.classList.remove("success");
    usernameMassage.classList.remove("error");
  } else {
    usernameMassage.classList.add("error");
  }
});
// ******** email ********
const emailMassage = document.getElementById("emailMassage");
const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

emailInput.addEventListener("focus", (event) => {
  const email = event.target.value.trim();
  if (emailRegex.test(email)) {
    emailMassage.classList.add("user-massge");
    emailMassage.classList.add("success");
    emailMassage.textContent = "valid email ";
  } else {
    emailMassage.classList.add("user-massge");
  }
});

emailInput.addEventListener("input", (event) => {
  const email = event.target.value.trim();
  if (emailRegex.test(email)) {
    emailMassage.classList.add("success");
    emailMassage.textContent = "valid email ";
  } else {
    emailMassage.classList.remove("success");
    emailMassage.textContent =
      "Enter a valid email  Enter validat e-mail 'user@domain.io'";
  }
});
emailInput.addEventListener("blur", (event) => {
  const email = event.target.value.trim();
  if (emailRegex.test(email)) {
    emailMassage.classList.remove("user-massge");
    emailMassage.classList.remove("success");
  } else {
    emailMassage.classList.add("error");
  }
});
//***********password*********
const passwordMassage = document.getElementById("passwordMassage");
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[\S@$!%*?&#]{8,}$/;

passwordInput.addEventListener("focus", (event) => {
  const password = event.target.value;
  if (passwordRegex.test(password)) {
    passwordMassage.classList.add("user-massge");
    passwordMassage.classList.add("success");
    passwordMassage.textContent = "valid password ";
  } else {
    passwordMassage.classList.add("user-massge");
  }
});

passwordInput.addEventListener("input", (event) => {
  const password = event.target.value;
  if (passwordRegex.test(password)) {
    passwordMassage.classList.add("success");
    passwordMassage.textContent = "valid password ";
  } else {
    passwordMassage.classList.remove("success");
    passwordMassage.textContent =
      "Password must have at least 8 characters, including an uppercase letter, a lowercase letter, a digit, and a special character, and must not contain spaces.";
  }
});
passwordInput.addEventListener("blur", (event) => {
  const password = event.target.value.trim();
  if (passwordRegex.test(password)) {
    passwordMassage.classList.remove("user-massge");
    passwordMassage.classList.remove("success");
  } else {
    passwordMassage.classList.add("error");
  }
});

//***********confirm password*********

const confirmPasswordMassage = document.getElementById(
  "confirmPasswordMassage"
);

confirmPassword.addEventListener("focus", (event) => {
  const confirmPassword = event.target.value;
  const password = passwordInput.value;
  if (confirmPassword === password) {
    confirmPasswordMassage.classList.add("user-massge");
    confirmPasswordMassage.classList.add("success");
    confirmPasswordMassage.textContent = "matching password ";
  } else {
    confirmPasswordMassage.classList.add("user-massge");
    confirmPasswordMassage.textContent = "password doesn't match";
  }
});

confirmPassword.addEventListener("input", (event) => {
  const password = passwordInput.value;
  const confirmPassword = event.target.value;
  if (confirmPassword === password) {
    confirmPasswordMassage.classList.add("success");
    confirmPasswordMassage.textContent = "matching password ";
  } else {
    confirmPasswordMassage.classList.remove("success");
    confirmPasswordMassage.textContent = "password doesn't match";
  }
});

confirmPassword.addEventListener("blur", (event) => {
  const password = passwordInput.value;
  const confirmPassword = event.target.value;
  if (confirmPassword === password) {
    confirmPasswordMassage.classList.remove("user-massge");
    confirmPasswordMassage.classList.remove("success");
  } else {
    confirmPasswordMassage.classList.add("error");
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    !usernameRegex.test(usernameInput.value.trim()) ||
    !passwordRegex.test(passwordInput.value) ||
    confirmPassword.value !== passwordInput.value ||
    !emailRegex.test(emailInput.value.trim())
  ) {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
      if (!input.value) {
        index == 0 ? usernameMassage.classList.add("user-massge", "error") : "";
        index == 1 ? emailMassage.classList.add("user-massge", "error") : "";
        index == 2 ? passwordMassage.classList.add("user-massge", "error") : "";
        index == 3
          ? confirmPasswordMassage.classList.add("user-massge", "error")
          : "";
      }
    });
  } else {
    const newUser = {
      username: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      address: "",
    };
    console.log(JSON.stringify(newUser));

    fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("userId", data._id);
        localStorage.setItem("userName", data.username);
        localStorage.setItem("email", data.email);
        localStorage.setItem("cart", JSON.stringify(data.cart));
        localStorage.setItem("orders", JSON.stringify(data.orders));
        localStorage.setItem("wishList", JSON.stringify(data.wishlist));

        alert("User registered successfully!");
        location.href = "/ui/home.html";
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  }
});
