let currentIndex = 0;
let products = [];
const productsPerView = 4;

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const allProducts = await response.json();
    products = allProducts.slice(0, 8); // Display only 8 products
    renderProducts();
    setupSlider();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

renderProducts = () => {
  var productCard = document.createElement("div");
  productCard.className = "product_card";
  productCard.innerHTML = `<span class="product_badge">20%</span>
                                  <span class="wish-icon">
                                      <i class="fa-regular fa-heart"></i>
                                  </span>
                                  <img src=${
                                    product.thumbnail
                                  } alt="product img" />
                                  <div class="product-content">
                                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; color: #db5807;">
                                          <div class="product-category">${
                                            product.category
                                          }</div>
                                          <div class="product-brand">${
                                            product.brand
                                          }</div>
                                      </div>
                                      <a href="" class="product_link">
                                          <div class="product-name ">${
                                            product.name
                                          }</div>
                                      </a>
                                      <div class="description">${
                                        product.description.substring(0, 60) +
                                        "...."
                                      }</div>
                                      <div class="rating">
                                          <i class="fa-solid fa-star" style="color: #FFD43B;"></i>${
                                            product.rating
                                          }
                                      </div>
                                      <hr />
                                      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                          <div class="price">$ ${
                                            product.price
                                          }</div>
                                          <button class="btn add-to-cart ">
                                              <i class="fa-solid fa-cart-plus" style="margin-right: 5px;"></i>Add to Cart
                                          </button>
                                      </div>
                                  </div>`;
  productsContainer.appendChild(productCard);
};

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
