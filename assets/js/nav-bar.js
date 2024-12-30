var test = document.querySelector(".account span");
console.log(test);
document.querySelector(".account span").innerHTML = `${
  JSON.parse(localStorage.getItem("user")).userName
}`;

// wishlist
const numWishlist = document.querySelector(".wishlist .badge");
console.log(JSON.parse(localStorage.getItem("user")).wishList.length);

numWishlist.textContent = JSON.parse(
  localStorage.getItem("user")
).wishList.length;

// cart
const numCart = document.querySelector(".cart .badge");
numCart.textContent = JSON.parse(localStorage.getItem("user")).cart.length;
