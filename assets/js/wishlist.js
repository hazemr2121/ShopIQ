import { addToCart, updateWishlist } from "../../utils/product.js";

async function fetchUserWishlist() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.wishList) {
      throw new Error("User not found or wishlist is empty");
    }

    // Assuming wishList is an array of product objects
    const products = user.wishList;
    return products;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
}

function renderWishlist(products) {
  const wishlistElement = document.getElementById("wishlist");
  if (products.length === 0) {
    wishlistElement.innerHTML =
      '<div class="error">Your wishlist is empty</div>';
    return;
  }

  products.forEach((product) => {
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
              <span class="wish-icon" data-wished="true" data-product_id="${
                product._id
              }">
                  <i class="fa-solid fa-heart active" style="color: #b80f0f; "></i>
                  <i class="fa-regular fa-heart "></i>
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

    wishlistElement.appendChild(productCard);
  });
  var cartBtns = document.querySelectorAll(".add-to-cart");
  cartBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(
        { product: btn.dataset.product_id },
        JSON.parse(localStorage.getItem("user")).userId
      ).then((res) => {
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

// Initialize the page
async function initWishlist() {
  try {
    const products = await fetchUserWishlist();
    renderWishlist(products);
  } catch (error) {
    document.getElementById("wishlist").innerHTML = `
                <div class="error">Error loading wishlist. Please try again later.</div>
            `;
  }
}

// Load the wishlist when the page loads
window.addEventListener("load", initWishlist);
