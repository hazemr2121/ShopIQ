var test = document.querySelector(".account span");
console.log(test);
document.querySelector(".account span").innerHTML = `${
  JSON.parse(localStorage.getItem("user")).userName
}`;

// cart
var chartCount = JSON.parse(localStorage.getItem("user")).cart.length;
document.querySelector(".cart .badge").innerHTML = chartCount;
// wishlist
var wishlistCount = JSON.parse(localStorage.getItem("user")).wishList.length;
console.log(wishlistCount);
document.querySelector(".wishlist .badge").innerHTML = wishlistCount;
