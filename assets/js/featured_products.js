import { addToCart, updateWishlist } from "../../utils/product.js";
let currentIndex = 0;
let productsElements = [];
const productsPerView = 4;

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const products = await response.json();
    productsElements = products.data.slice(10, 18); // Display only 8 products
    renderProducts();
    setupSlider();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function renderProducts() {
  const container = document.querySelector(".products-slider");
  container.innerHTML = "";

  productsElements.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
              ${
                product.discountPercentage
                  ? `<span class="product-badge">${Math.round(
                      product.discountPercentage
                    )}% OFF</span>`
                  : ""
              }
              <span class="wish-icon" data-wished="false" data-product_id="${
                product._id
              }">
                  <i class="fa-solid fa-heart" style="color: #b80f0f;"></i>
                  <i class="fa-regular fa-heart active"></i>
              </span>
              <img src="${product.thumbnail}" alt="${
      product.name
    }" class="product-image">
              <div class="product-content">
                  <div style="display: flex; justify-content: space-between;">
                      <div class="product-category">${product.category}</div>
                      <div class="product-brand">${product.brand}</div>
                  </div>
                  <h3 class="product-name">${product.title}</h3>
                  <div class="description">${product.description.substring(
                    0,
                    60
                  )}...</div>
                  <div class="rating">
                      <i class="fa-solid fa-star"></i> ${product.rating}
                  </div>
                  <hr>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                      <div class="price">$${product.price}</div>
                      <button class="add-to-cart" data-product_id="${
                        product._id
                      }">
                          <i class="fa-solid fa-cart-plus"></i> Add to Cart
                      </button>
                  </div>
              </div>
          `;

    container.appendChild(productCard);
  });
  var cartBtns = document.querySelectorAll(".add-to-cart");
  cartBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(
        { product: btn.dataset.product_id },
        JSON.parse(localStorage.getItem("user")).userId
      ).then((res) => {
        console.log(res);
        fetch(
          "http://localhost:3000/api/users/" +
            JSON.parse(localStorage.getItem("user")).userId
        ).then(async (res) => {
          const data = await res.json();
          console.log(data);
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
          };

          localStorage.setItem("user", JSON.stringify(userData));
          // localStorage.setItem("user", JSON.stringify(data));
        });
        Toastify({
          text: "Product added to Cart Successfully",
          className: "info",
          position: "left",
        }).showToast();
      });
    });
  });

  var wishBtns = document.querySelectorAll(".wish-icon");
  wishBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      var product_data;
      var msg;

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

      updateWishlist(
        product_data,
        JSON.parse(localStorage.getItem("user")).userId
      ).then((data) => {
        fetch(
          "http://localhost:3000/api/users/" +
            JSON.parse(localStorage.getItem("user")).userId
        ).then(async (res) => {
          const data = await res.json();
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
          };
          localStorage.setItem("user", JSON.stringify(userData));
          var wishlistCount = JSON.parse(localStorage.getItem("user")).wishList
            .length;
          document.querySelector(".wishlist .badge").innerHTML = wishlistCount;
        });

        Toastify({
          text: msg,
          className: "info",
          position: "left",
        }).showToast();
      });
    });
  });
}

function setupSlider() {
  const slider = document.querySelector(".products-slider");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");

  function updateSliderPosition() {
    const cardWidth = slider.querySelector(".product-card").offsetWidth;
    const translateX = -currentIndex * (cardWidth + 20); // 20px is the gap
    slider.style.transform = `translateX(${translateX}px)`;
  }

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSliderPosition();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < productsElements.length - productsPerView) {
      currentIndex++;
      updateSliderPosition();
    }
  });
}

// Initialize
fetchProducts();
