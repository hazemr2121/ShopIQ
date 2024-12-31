import {
  addToCart,
  updateWishlist,
  createProductEle,
  getProducts,
  paginate,
  createPaginationBtns,
} from "./../../utils/product.js";
import Filters from "../../utils/filter.js";

var categoryValue = "";
var ratingFilterValue = "";
var priceFromValue = "";
var priceToValue = "";

document.getElementById("loading").style.display = "block";
var productsContainer = document.querySelector(".store_page .products-list");
var productsLength = document.querySelector(".store_page .product-count span");
let paginationParent = document.querySelector(".pagination");
let category = new URLSearchParams(window.location.search).get("category");
console.log(category);
let endpoint = category
  ? `http://localhost:3000/api/products?category=${category}`
  : "http://localhost:3000/api/products";

var productsData = [];
getProducts(endpoint)
  .then((res) => {
    document.querySelector(".store_page .small-filters button").style.display = "block";
    document.querySelector(".store_page .container_content").style.display =
      "flex";
      
    document.getElementById("loading").style.display = "none";

    // let category = new URLSearchParams(window.location.search).get("category");
    // let rating = new URLSearchParams(window.location.search).get("rating");
    // let priceFrom = new URLSearchParams(window.location.search).get("priceFrom");
    // let priceTo = new URLSearchParams(window.location.search).get("priceTo");

    // let filteredProducts;
    // var filter = new Filters(products.data);

    // filteredProducts = filter.filterByCategory(category).filterByRating(rating).filterByPrice(priceFrom, priceTo).getProductsData();
    // let filteredProducts = category ? res.data.filter(product => product.category == category) : res.data

    productsData = res.data;
    // console.log(productsData)
    productsLength.innerHTML = res.length;
    productsData.slice(0, 9).forEach((product) => {
      const productCard = createProductEle(product);

      productsContainer.appendChild(productCard);
    });

    var cartBtns = document.querySelectorAll(".add-to-cart");
    cartBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!localStorage.getItem("user")) {
          location.href = "/login&register/login.html";
        } else {
          var addToCartBody;
          if (user.cart.some((item) => item.product._id == btn.dataset.product_id)) {
            addToCartBody = {
              product: btn.dataset.product_id,
              action: "plus",
            }

          } else {
            addToCartBody = {
              product: btn.dataset.product_id
            }
          }
          addToCart(
            addToCartBody,
            user.userId
          ).then((res) => {
            fetch(`http://localhost:3000/api/users/${user.userId}`).then(async res => {
              const data = await res.json()
              const updatedUser = {
                userId: data._id,
                userName: data.username,
                address: data.address,
                phone: data.phone,
                orders: data.orders,
                role: data.role,
                wishList: data.wishlist,
                email: data.email,
                cart: data.cart,
                createdAt: new Date(data.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              }
              localStorage.setItem("user", JSON.stringify(updatedUser));
            })
            Toastify({
              text: "Product added to Cart Successfully",
              className: "info",
            }).showToast();

          });

        }
      });
    });

    var wishBtns = document.querySelectorAll(".wish-icon");
    wishBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!localStorage.getItem("user")) {
          location.href = "/login&register/login.html";
        } else {
          var product_data;
          var msg;
          console.log(btn.dataset.wished);
          if (btn.dataset.wished == "false") {
            btn.dataset.wished = "true";
            btn.children[1].classList.toggle("active");
            btn.children[0].classList.toggle("active");

            product_data = {
              action: "add",
              id: btn.dataset.product_id,
            };
            msg = "Product added to Wishlist Successfully";
          } else if (btn.dataset.wished == "true") {
            btn.dataset.wished = "false";
            btn.children[1].classList.toggle("active");
            btn.children[0].classList.toggle("active");

            product_data = {
              action: "remove",
              id: btn.dataset.product_id,
            };
            msg = "Product removed from Wishlist Successfully";
          }

          updateWishlist(product_data, JSON.parse(localStorage.getItem("user")).userId).then(
            (data) => {
              Toastify({
                text: msg,
                className: "info",
              }).showToast();
            }
          );
        }
      });
    });

    // create pagination btns
    createPaginationBtns(paginationParent, productsData.length);

    var pageBtns = document.querySelectorAll(".pagination button");
    pageBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log(btn.dataset.page);

        productsData = paginate(res.data, btn.dataset.page);
        productsContainer.innerHTML = "";
        productsLength.innerHTML = productsData.length;

        productsData.forEach((product) => {
          let productCard = createProductEle(product);
          productsContainer.appendChild(productCard);
        });
        window.scrollTo(0, 0);
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });

async function getCategories() {
  const response = await fetch("http://localhost:3000/api/categories");
  const data = await response.json();
  return data;
}

getCategories().then((data) => {
  var categoryList = document.querySelectorAll(
    "#category-accordion .categories"
  );


  data.forEach((category) => {
    var categoryItem = document.createElement("p");
    categoryItem.className = "category-item";
    categoryItem.innerHTML = `${category}`;
    categoryItem.dataset.category = `${category}`;
    categoryList[0].appendChild(categoryItem);

  });

  data.forEach((category) => {
    var categoryItem = document.createElement("p");
    categoryItem.className = "category-item";
    categoryItem.innerHTML = `${category}`;
    categoryItem.dataset.category = `${category}`;
    categoryList[1].appendChild(categoryItem);

  });


  var category_items = document.querySelectorAll(".category-item");
  category_items.forEach((item) => {
    item.onclick = (e) => {
      e.stopPropagation();
      categoryValue = item.dataset.category;
      getProducts(
        `http://localhost:3000/api/products?category=${categoryValue}&rating=${ratingFilterValue}&priceFrom=${priceFromValue}&priceTo=${priceToValue}`
      ).then((res) => {
        productsContainer.innerHTML = "";
        productsLength.innerHTML = res.length;
        productsData = res.data;
        createPaginationBtns(paginationParent, productsData.length);
        productsData.forEach((product) => {
          let productCard = createProductEle(product);
          productsContainer.appendChild(productCard);
        });

        var pageBtns = document.querySelectorAll(".pagination button");
        pageBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            console.log(btn.dataset.page);

            productsData = paginate(res.data, btn.dataset.page);
            console.log(productsData);
            productsContainer.innerHTML = "";
            productsLength.innerHTML = productsData.length;

            productsData.forEach((product) => {
              let productCard = createProductEle(product);
              productsContainer.appendChild(productCard);
            });
            window.scrollTo(0, 0);
          });
        });
      });
    };
  });
});

let category_accordion = document.querySelectorAll("#category-accordion");

category_accordion.forEach(accordion => {
  console.log(accordion)
  accordion.onclick = (e) => {
    e.stopPropagation();
    accordion.classList.toggle("active");
  }
})

let ratingSmallFilterElements = document.querySelectorAll(".small-filters .filters .ratings div");
ratingSmallFilterElements.forEach((ele) => {
  ele.onclick = () => {

    ratingFilterValue = ele.dataset.rating;
    getProducts(
      `http://localhost:3000/api/products?category=${categoryValue}&rating=${ratingFilterValue}&priceFrom=${priceFromValue}&priceTo=${priceToValue}`
    ).then((res) => {
      productsContainer.innerHTML = "";
      productsLength.innerHTML = res.length;
      productsData = res.data;
      createPaginationBtns(paginationParent, productsData.length);

      productsData.slice(0, 9).forEach((product) => {
        let productCard = createProductEle(product);
        productsContainer.appendChild(productCard);
      });

      var pageBtns = document.querySelectorAll(".pagination button");
      pageBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          console.log(btn.dataset.page);

          productsData = paginate(res.data, btn.dataset.page);
          console.log(productsData);
          productsContainer.innerHTML = "";
          productsLength.innerHTML = productsData.length;

          productsData.forEach((product) => {
            let productCard = createProductEle(product);
            productsContainer.appendChild(productCard);
          });
          window.scrollTo(0, 0);
        });
      });
    });
  };
});

let ratingElements = document.querySelectorAll(".main-filters .ratings div");
ratingElements.forEach((ele) => {
  ele.onclick = () => {

    ratingFilterValue = ele.dataset.rating;
    getProducts(
      `http://localhost:3000/api/products?category=${categoryValue}&rating=${ratingFilterValue}&priceFrom=${priceFromValue}&priceTo=${priceToValue}`
    ).then((res) => {
      productsContainer.innerHTML = "";
      productsLength.innerHTML = res.length;
      productsData = res.data;
      createPaginationBtns(paginationParent, productsData.length);

      productsData.slice(0, 9).forEach((product) => {
        let productCard = createProductEle(product);
        productsContainer.appendChild(productCard);
      });

      var pageBtns = document.querySelectorAll(".pagination button");
      pageBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          console.log(btn.dataset.page);

          productsData = paginate(res.data, btn.dataset.page);
          console.log(productsData);
          productsContainer.innerHTML = "";
          productsLength.innerHTML = productsData.length;

          productsData.forEach((product) => {
            let productCard = createProductEle(product);
            productsContainer.appendChild(productCard);
          });
          window.scrollTo(0, 0);
        });
      });
    });
  };
})

let priceFrom = document.querySelectorAll(".price .price-from");
let priceTo = document.querySelectorAll(".price .price-to");
let priceBtns = document.querySelectorAll(".price button");

priceBtns[0].onclick = () => {
  console.log(priceFrom[0].value, priceTo[0].value);

  priceFromValue = priceFrom[0].value;
  priceToValue = priceTo[0].value;
  getProducts(
    `http://localhost:3000/api/products?category=${categoryValue}&rating=${ratingFilterValue}&priceFrom=${priceFromValue}&priceTo=${priceToValue}`
  ).then((res) => {
    console.log(res);
    productsContainer.innerHTML = "";
    productsLength.innerHTML = res.length;
    productsData = res.data;
    createPaginationBtns(paginationParent, productsData.length);
    productsData.slice(0, 9).forEach((product) => {
      let productCard = createProductEle(product);
      productsContainer.appendChild(productCard);
    });

    var pageBtns = document.querySelectorAll(".pagination button");
    pageBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log(btn.dataset.page);

        productsData = paginate(res.data, btn.dataset.page);
        console.log(productsData);
        productsContainer.innerHTML = "";
        productsLength.innerHTML = productsData.length;

        productsData.forEach((product) => {
          let productCard = createProductEle(product);
          productsContainer.appendChild(productCard);
        });
        window.scrollTo(0, 0);
      });
    });
  });
}
priceBtns[1].onclick = () => {
  console.log(priceFrom[1].value, priceTo[1].value);

  priceFromValue = priceFrom[1].value;
  priceToValue = priceTo[1].value;
  getProducts(
    `http://localhost:3000/api/products?category=${categoryValue}&rating=${ratingFilterValue}&priceFrom=${priceFromValue}&priceTo=${priceToValue}`
  ).then((res) => {
    console.log(res);
    productsContainer.innerHTML = "";
    productsLength.innerHTML = res.length;
    productsData = res.data;
    createPaginationBtns(paginationParent, productsData.length);
    productsData.slice(0, 9).forEach((product) => {
      let productCard = createProductEle(product);
      productsContainer.appendChild(productCard);
    });

    var pageBtns = document.querySelectorAll(".pagination button");
    pageBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log(btn.dataset.page);

        productsData = paginate(res.data, btn.dataset.page);
        console.log(productsData);
        productsContainer.innerHTML = "";
        productsLength.innerHTML = productsData.length;

        productsData.forEach((product) => {
          let productCard = createProductEle(product);
          productsContainer.appendChild(productCard);
        });
        window.scrollTo(0, 0);
      });
    });
  });
};


let small_filters_btn = document.querySelector(".small-filters button")
let filters = document.querySelector(".small-filters .filters")
small_filters_btn.onclick = () => {
  filters.classList.toggle("active")
}