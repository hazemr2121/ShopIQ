var test = document.querySelector(".account span");
console.log(test);
document.querySelector(".account span").innerHTML = `${
  JSON.parse(localStorage.getItem("user")).userName
}`;

// cart

// wishlist
