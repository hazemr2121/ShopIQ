const changeAccount = document.querySelector(".account");
function changeUserName() {
  if (localStorage.getItem("user")) {
    changeAccount.innerHTML = `
      <a href="#" class="icon-link">
        <i class="fa fa-user"></i>
        <span>${JSON.parse(localStorage.getItem("user")).userName}</span>
      </a>
    `;
  }
}

changeUserName();

const signOut = document.getElementById("signout-btn");

signOut.addEventListener("click", () => {
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
      localStorage.clear("user");
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
      (user) => user._id === JSON.parse(localStorage.getItem("user")).userId
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
        `http://localhost:3000/api/users/${
          JSON.parse(localStorage.getItem("user")).userId
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userName.value,
            email: email.value,
            address: userAddress.value,
            phone: userPhone.value,
            password: newPassword.value ? newPassword.value : password,
          }),
        }
      )
        .then(async (response) => {
          let data = await response.json();
          console.log(data);

          const formatDateToReadable = (isoString) => {
            const options = { year: "numeric", month: "long", day: "numeric" };
            return new Date(isoString).toLocaleDateString(undefined, options);
          };
          const createdAt = formatDateToReadable(data.createdAt);
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
            createdAt: createdAt,
          };

          localStorage.setItem("user", JSON.stringify(userData));
          changeUserName();

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
userName.setAttribute(
  "value",
  JSON.parse(localStorage.getItem("user")).userName
);
email.setAttribute("value", JSON.parse(localStorage.getItem("user")).email);
userAddress.setAttribute(
  "value",
  JSON.parse(localStorage.getItem("user")).address
    ? JSON.parse(localStorage.getItem("user")).address
    : ""
);
userPhone.setAttribute(
  "value",
  JSON.parse(localStorage.getItem("user")).phone
    ? JSON.parse(localStorage.getItem("user")).phone
    : ""
);

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

const createdAtElement = document.querySelector("#createdAt span");
createdAtElement.textContent = `${
  JSON.parse(localStorage.getItem("user")).createdAt
}`;
const orders = document.querySelector("#your-orders span");
orders.textContent = `${
  JSON.parse(localStorage.getItem("user")).orders.length
}`;

// get orders
let statusOrder = [];
let color;
async function fetchOrders() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      throw new Error("User not found in localStorage.");
    }

    const userId = user.userId;
    console.log(userId);

    const response = await fetch(`http://localhost:3000/api/orders`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const orders = await response.json();
    console.log(orders[0].user._id);
    console.log(orders);
    const userOrders = orders.filter((order) => {
      if (order.user) {
        return order.user._id == userId;
      }
    });

    userOrders.forEach((order, index) => {
      console.log(order.status);
      if (order.status === "pending") {
        color = "#b2b246";
      } else if (order.status === "accepted") {
        color = "#008000a3";
      } else {
        color = "#e63b3b";
      }
      const statusObj = {
        status: order.status,
        color: color,
      };
      statusOrder.push(statusObj);
    });
    getOrderDetails();
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

fetchOrders();

console.log(JSON.parse(localStorage.getItem("user")).orders);
const orderStatus = document.getElementById("orders-section");
const finishedOrders = JSON.parse(localStorage.getItem("user")).orders;

if (!finishedOrders.length) {
  orderStatus.innerHTML = "<p>No orders found.</p>";
}
function getOrderDetails() {
  finishedOrders.forEach((order, orderIndex) => {
    const totalPrice = order.products
      .reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0)
      .toFixed(2);
    console.log(order.products);
    // Display the order summary

    orderStatus.innerHTML += `
  <button class="accordion accordion-order">

      <h3>Order #${orderIndex + 1}</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Price:</strong> $${totalPrice}</p>
      <p><strong>Number of Products:</strong> ${order.products.length}</p>
      <p style="color:${statusOrder[orderIndex].color}"><strong> ${
      statusOrder[orderIndex].status
    }</strong> </p>

    </button>
    <div class="panel" id="panel-${orderIndex}"></div>
  `;
    // panding accepted rejected
    const panel = document.getElementById(`panel-${orderIndex}`);
    order.products.forEach((item) => {
      panel.innerHTML += `

      <div class="product-details">
        <img src="${item.product.thumbnail}" alt="${item.product.title}" />
        <div class="product-info">
          <h4>${item.product.title}</h4>
          <p><strong>Brand:</strong> ${item.product.brand}</p>
          <p><strong>Category:</strong> ${item.product.category}</p>
          <p><strong>Price:</strong> $${item.product.price}</p>
          <p><strong>Quantity:</strong> ${item.quantity}</p>
        </div>
      </div>

    `;
    });
  });
  showAccordionOrders();
}

function changePassword() {
  const acc = document.getElementById("accordion");
  console.log(acc);

  acc.addEventListener("click", function (e) {
    e.preventDefault();

    let panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
changePassword();

function showAccordionOrders() {
  const acc = document.getElementsByClassName("accordion-order");

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function (e) {
      e.preventDefault();

      console.log("Toggling panel for:", acc[i]);

      // Get the corresponding panel
      let panel = this.nextElementSibling;

      // Toggle the display style
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
}
