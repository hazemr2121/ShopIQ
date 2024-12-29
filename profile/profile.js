const changeAccount = document.querySelector(".account");
if (localStorage.getItem("userName")) {
  changeAccount.innerHTML = `
    <a href="../profile/profile.html" class="icon-link">
      <i class="fa fa-user"></i>
      <span>${localStorage.getItem("userName")}</span>
    </a>
  `;
}

const signOut = document.getElementById("signout-btn");

signOut.addEventListener("click", () => {
  // Attach this to your log-out button's click event

  Swal.fire({
    title: "Are you sure?",
    // text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "sure",
    cancelButtonText: "No",
    customClass: {
      popup: "minimized-alert",
      confirmButton: "btn-confirm",
      cancelButton: "btn-cancel",
    },
    buttonsStyling: false,
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      location.href = "../login&register/login.html";
    }
  });
});

const infoSection = document.getElementById("info-section");

const userName = document.getElementById("user-name");
const userAddress = document.getElementById("user-adress");
const regExpPhone = /^[0-9]{0,}$/;
const userPhone = document.getElementById("user-phone");
const email = document.getElementById("email");
const changeOldPassword = document.getElementById("old-password");
const newPassword = document.getElementById("new-password");
const confirmNewPassword = document.getElementById("confirm-password");
const errorUserNameMessage = document.getElementById("username-error");
const errorPhoneMessage = document.getElementById("phone-error");
const oldPasswordError = document.getElementById("old-password-error");
const newPasswordError = document.getElementById("new-password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");

userName.addEventListener("focus", (event) => {
  const username = event.target.value.trim();
  if (username) {
    errorUserNameMessage.classList.remove("active");
  } else {
    errorUserNameMessage.classList.add("active");
  }
});

userName.addEventListener("input", (event) => {
  const username = event.target.value.trim();
  if (username) {
    errorUserNameMessage.classList.remove("active");
  } else {
    errorUserNameMessage.classList.add("active");
  }
});
userName.addEventListener("blur", (event) => {
  const username = event.target.value.trim();
  if (username) {
    errorUserNameMessage.classList.remove("active");
  } else {
    errorUserNameMessage.classList.add("active");
  }
});
userPhone.addEventListener("focus", (event) => {
  const userphone = event.target.value.trim();
  if (regExpPhone.test(userphone)) {
    errorPhoneMessage.classList.remove("active");
  } else {
    errorPhoneMessage.classList.add("active");
  }
});

userPhone.addEventListener("input", (event) => {
  const userphone = event.target.value.trim();
  if (regExpPhone.test(userphone)) {
    errorPhoneMessage.classList.remove("active");
  } else {
    errorPhoneMessage.classList.add("active");
  }
});
userPhone.addEventListener("blur", (event) => {
  const userphone = event.target.value.trim();
  if (regExpPhone.test(userphone)) {
    errorPhoneMessage.classList.remove("active");
  } else {
    errorPhoneMessage.classList.add("active");
  }
});

// check the old password
fetch("http://localhost:3000/api/users")
  .then((res) => res.json())
  .then((data) => {
    const user = data.find(
      (user) => user._id === localStorage.getItem("userId")
    );

    password = user.password;
    console.log(password);
  });

changeOldPassword.addEventListener("input", (event) => {
  const oldPassword = event.target.value.trim();

  if (oldPassword === password) {
    newPassword.disabled = false;
  }
  if (oldPassword === password || oldPassword === "") {
    oldPasswordError.classList.remove("active");
  } else {
    oldPasswordError.classList.add("active");
  }
});
changeOldPassword.addEventListener("blur", (event) => {
  const oldPassword = event.target.value.trim();
  if (oldPassword === password) {
    oldPasswordError.classList.remove("active");
  }
});

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[\S@$!%*?&#]{8,}$/;
newPassword.addEventListener("input", (event) => {
  const newPassword = event.target.value.trim();
  if (passwordRegex.test(newPassword)) {
    newPasswordError.classList.remove("active");
    confirmNewPassword.disabled = false;
  } else {
    newPasswordError.classList.add("active");
  }
});
newPassword.addEventListener("blur", (event) => {
  const newPassword = event.target.value.trim();
  if (passwordRegex.test(newPassword)) {
    newPasswordError.classList.remove("active");
  }
});
confirmNewPassword.addEventListener("input", (event) => {
  const confirmPassword = event.target.value.trim();
  if (confirmPassword == newPassword.value) {
    confirmPasswordError.classList.remove("active");
  } else {
    confirmPasswordError.classList.add("active");
  }
});
confirmNewPassword.addEventListener("blur", (event) => {
  const confirmPassword = event.target.value.trim();
  if (confirmPassword == newPassword.value) {
    confirmPasswordError.classList.remove("active");
  }
});

function updateInfoSection() {
  const updateInfo = document.querySelector(".update-info");
  updateInfo.addEventListener("click", (event) => {
    event.preventDefault();
    const isPasswordRegex = newPassword.value
      ? passwordRegex.test(newPassword.value)
      : true;

    const isOldPasswordValid = changeOldPassword.value
      ? changeOldPassword.value === password
      : true;

    if (
      userName.value &&
      regExpPhone.test(userPhone.value) &&
      newPassword.value == confirmNewPassword.value &&
      isPasswordRegex &&
      isOldPasswordValid
    ) {
      fetch(
        `http://localhost:3000/api/users/${localStorage.getItem("userId")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userName.value,
            email: localStorage.getItem("email"),
            address: userAddress.value,
            phone: userPhone.value,
            password: newPassword.value ? newPassword.value : password,
          }),
        }
      )
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
          localStorage.setItem("address", data.address);
          localStorage.setItem("phone", data.phone);
          localStorage.setItem("orders", JSON.stringify(data.orders));
          localStorage.setItem("wishList", JSON.stringify(data.wishlist));
          const formatDateToReadable = (isoString) => {
            const options = { year: "numeric", month: "long", day: "numeric" };
            return new Date(isoString).toLocaleDateString(undefined, options);
          };
          const createdAt = formatDateToReadable(data.createdAt);
          localStorage.setItem("createdAt", createdAt);

          changeOldPassword.value = "";
          newPassword.value = "";
          confirmNewPassword.value = "";
          newPassword.disabled = true;
          confirmNewPassword.disabled = true;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
}
updateInfoSection();
userName.setAttribute("value", localStorage.getItem("userName"));
email.setAttribute("value", localStorage.getItem("email"));
userAddress.setAttribute(
  "value",
  localStorage.getItem("address") ? localStorage.getItem("address") : ""
);
userPhone.setAttribute(
  "value",
  localStorage.getItem("phone") ? localStorage.getItem("phone") : ""
);

function changePassword() {
  const acc = document.getElementById("accordion");

  acc.addEventListener("click", function (e) {
    e.preventDefault();

    // this.classList.toggle("active");
    let panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
changePassword();

const profileImage = document.getElementById("profileImage");
const photoInput = document.getElementById("photoInput");
const updatePhotoBtn = document.getElementById("updatePhotoBtn");

updatePhotoBtn.addEventListener("click", () => {
  photoInput.click();
});

photoInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// status section

{
  /* <div class="status">
  <h5 id="createdAt">
    🟢 active since: <span></span>
  </h5>
  <h5 id="your-orders">
    your orders : <span></span>
  </h5>
  <h5 id="last-order">
    the last order : <span>not yet</span>
  </h5>
</div>; */
}

const createdAtElement = document.querySelector("#createdAt span");
createdAtElement.textContent = `${localStorage.getItem("createdAt")}`;
const orders = document.querySelector("#your-orders span");
console.log(localStorage.getItem("orders")[0]);
orders.textContent = `${localStorage.getItem("orders").length}`;
