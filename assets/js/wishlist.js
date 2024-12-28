async function fetchUserWishlist() {
  try {
    const userResponse = await fetch("http://localhost:3000/api/users");
    const users = await userResponse.json();
    const user = users.find((u) => u.username === "3dola");

    if (!user) {
      throw new Error("User not found");
    }

    const productPromises = user.wishlist.map((productId) =>
      fetch(`http://localhost:3000/api/products/${productId}`).then((res) =>
        res.json()
      )
    );

    const products = await Promise.all(productPromises);
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

  const productsHTML = products
    .map(
      (product) => `
            <div class="product-card">
                ${
                  product.discountPercentage
                    ? `
                    <div class="discount-badge">${product.discountPercentage.toFixed(
                      2
                    )}%</div>
                `
                    : ""
                }
                <div class="wishlist-icon">♥</div>
                <img src="${product.thumbnail}" alt="${
        product.title
      }" class="product-image">
                <div class="product-category">${product.category}</div>
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">★ ${product.rating}</div>
                <div class="product-price">$ ${product.price.toFixed(2)}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `
    )
    .join("");

  wishlistElement.innerHTML = productsHTML;
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
