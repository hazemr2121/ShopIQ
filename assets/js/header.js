// get categories from firebase
function getCategories() {
  const categoriesRef = ref(db, "categories");
  onValue(categoriesRef, (snapshot) => {
    const categories = snapshot.val();
    console.log(categories);

    var selectElement = document.createElement("select");
    selectElement.className = "category-dropdown";

    categories.forEach((category) => {
      var optionElement = document.createElement("option");
      optionElement.value = category;
      optionElement.textContent = category;
      selectElement.appendChild(optionElement);
    });

    document.querySelector(".filters .categories").appendChild(selectElement);
  });
}

getCategories();

document.getElementById("dropdown-btn").addEventListener("click", function () {
  document.querySelector(".filters").classList.toggle("show");
});
