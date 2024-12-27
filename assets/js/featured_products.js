let currentIndex = 0;
let products = [];
const productsPerView = 4;

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const allProducts = await response.json();
    products = allProducts.slice(10, 18); // Display only 8 products
    renderProducts();
    setupSlider();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function renderProducts() {
  const container = document.querySelector(".products-slider");
  container.innerHTML = "";

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
              <span class="wish-icon">
                  <i class="fa-regular fa-heart"></i>
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
                      <button class="add-to-cart">
                          <i class="fa-solid fa-cart-plus"></i> Add to Cart
                      </button>
                  </div>
              </div>
          `;

    container.appendChild(productCard);
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
    if (currentIndex < products.length - productsPerView) {
      currentIndex++;
      updateSliderPosition();
    }
  });
}

// Initialize
fetchProducts();
