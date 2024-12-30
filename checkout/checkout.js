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
const inputs = document.querySelectorAll("input");
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
    alert("Order placed successfully!");
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
