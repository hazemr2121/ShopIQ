import { updateOrders, updateUserOrders } from "../utils/product.js";

const fields = [
  { id: "address", regex: /.{3,}/ },
  { id: "cardholder", regex: /.{3,}/ },
  { id: "card-number", regex: /^[0-9]{16}$/ },
  { id: "exp-date", regex: /.+/ },
  { id: "cvv", regex: /^[0-9]{3,4}$/ },
  { id: "phone", regex: /^[0-9]{10,15}$/ },
  { id: "email", regex: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ },
];

const errorMessage = document.querySelectorAll(".hiden");

let inputs = Array.from(document.querySelectorAll("input"));
inputs.shift();

console.log(inputs);
const terms = document.getElementById("terms");
terms.addEventListener("change", () => {
  if (terms.checked) {
    errorMessage[errorMessage.length - 1].classList.remove("active");
  } else {
    errorMessage[errorMessage.length - 1].classList.add("active");
  }
});

inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    const field = fields.find((f) => f.id === input.id);
    console.log(field);
    if (field && field.regex.test(input.value.trim())) {
      errorMessage[index].classList.remove("active");
    } else {
      errorMessage[index].classList.add("active");
    }
  });
});

document.getElementById("place-order").addEventListener("click", function (e) {
  e.preventDefault();

  let isValid = true;

  fields.forEach((field, index) => {
    const input = document.getElementById(field.id);

    if (!field.regex.test(input.value.trim())) {
      errorMessage[index].classList.add("active");
      isValid = false;
    } else {
      errorMessage[index].classList.remove("active");
    }
  });

  if (!terms.checked) {
    errorMessage[errorMessage.length - 1].classList.add("active");
    isValid = false;
  } else {
    errorMessage[errorMessage.length - 1].classList.remove("active");
  }

  if (isValid) {
    const cartItems = JSON.parse(localStorage.getItem("user")).cart;
    const orderItems = {
      products: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      user: JSON.parse(localStorage.getItem("user")).userId,
    };

    const userOrder = {
      products: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
    };

    console.log(userOrder);

    // const orderItems = {
    //   products: [
    //     {
    //       product: "676af4b8892744d5e1855e50",
    //       quantity: 7,
    //     },
    //     {
    //       product: "676af4b8892744d5e1855e52",
    //     },
    //   ],
    // user: JSON.parse(localStorage.getItem("user")).userId,
    // };
    updateOrders(orderItems).then((data) => {
      updateUserOrders(
        userOrder,
        JSON.parse(localStorage.getItem("user")).userId
      ).then((res) => {
        const user = JSON.parse(localStorage.getItem("user"));
        // user.cart = [];
        // localStorage.setItem("user", JSON.stringify(user));
        //here

        // Fetch updated user data and update localStorage
        fetch(`http://localhost:3000/api/users/${user.userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: [] }),
        })
          .then((response) => response.json())
          .then((updatedUser) => {
            const userData = {
              userId: updatedUser._id,
              userName: updatedUser.username,
              address: updatedUser.address,
              phone: updatedUser.phone,
              orders: updatedUser.orders,
              role: updatedUser.role,
              wishList: updatedUser.wishlist,
              email: updatedUser.email,
              cart: updatedUser.cart,
              createdAt: new Date(updatedUser.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              ),
            };
            localStorage.setItem("user", JSON.stringify(userData));
            location.href = "../profile/profile.html";
          })
          .catch((error) => console.error("Error fetching user data:", error));
      });
    });
  }
});

const orders = document.querySelector("#orders");
const ordersPrice = document.querySelector("#orders-price");

let orderPrice = 0;

console.log(JSON.parse(localStorage.getItem("user")).cart);
let ordersItems = JSON.parse(localStorage.getItem("user")).cart;

ordersItems.forEach((item) => {
  orders.innerHTML += `
      <p><strong>${item.product.title} x ${
    item.quantity
  }</strong> <span>$${item.product.price.toFixed(2)}</span></p>
    `;
  orderPrice += item.product.price;
});

document.getElementById("subtotal").textContent = orderPrice.toFixed(2);
document.getElementById("total-price").textContent = (orderPrice + 5.0).toFixed(
  2
);

let place_order_btn = document.getElementById("place-order");
place_order_btn.addEventListener("click", () => {});
