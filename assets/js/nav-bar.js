var test = document.querySelector(".account span");
console.log(test);

if (localStorage.getItem("user")) {
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
}

let dropdown = document.querySelector(".categories-dropdown");
dropdown.addEventListener("click", () => {
  document
    .querySelector(".categories-dropdown .category-content")
    .classList.toggle("active");
});
console.log(dropdown);

async function getCategories() {
  const response = await fetch("http://localhost:3000/api/categories");
  const data = await response.json();
  return data;
}

getCategories().then((res) => {
  var categoryList = document.querySelector(
    ".categories-dropdown .category-content"
  );
  res.forEach((category) => {
    var categoryItem = document.createElement("a");
    categoryItem.href = `./../store.html?category=${category}`;
    categoryItem.innerHTML = `${category}`;
    categoryList.appendChild(categoryItem);
  });
});
