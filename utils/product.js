export async function getProducts(
  endpoint = "http://localhost:3000/api/products"
) {
  try {
    const response = await fetch(endpoint);
    const products = await response.json();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export function paginate(products, page) {
  products = products.slice((page - 1) * 9, page * 9);

  return products;
}

export function createPaginationBtns(paginationEle, productLength) {
  paginationEle.innerHTML = "";
  for (let index = 1; index <= Math.ceil(productLength / 9); index++) {
    let btn = document.createElement("button");
    btn.dataset.page = index;
    btn.innerHTML = index;
    paginationEle.appendChild(btn);
  }
}

export async function addToCart(product_data, user_id) {
  const response = await fetch(
    `http://localhost:3000/api/users/${user_id}/cart`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product_data),
    }
  );

  const data = await response.json();
  return data;
}

export async function updateWishlist(product_data, user_id) {
  const response = await fetch(
    `http://localhost:3000/api/users/${user_id}/wishlist`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product_data),
    }
  );

  const data = await response.json();
  return data;
}

export function createProductEle(productData) {
  let {
    _id,
    title,
    category,
    price,
    description,
    discountPercentage,
    rating,
    brand,
    thumbnail,
  } = productData;

  var productCard = document.createElement("div");
  productCard.className = "product_card";
  productCard.innerHTML = `<span class="product_badge">${discountPercentage}%</span>
                                <span class="wish-icon" data-product_id=${_id} data-wished="false">
                                    <i class="fa-solid fa-heart" style="color: #b80f0f;"></i>
                                    <i class="fa-regular fa-heart active"></i>
                                </span>
                                <img src=${thumbnail} alt="product img" />
                                <div class="product-content">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; color: #db5807 !important;">
                                        <div class="product-category">${category}</div>
                                        <div class="product-brand">${brand}</div>
                                    </div>
                                    <a href="product_details.html?id=${_id}" class="product_link">
                                        <div class="product-name ">${title}</div>
                                    </a>
                                    <div class="description">${
                                      description.substring(0, 60) + "...."
                                    }</div>
                                    <div class="rating">
                                        <i class="fa-solid fa-star" style="color: #FFD43B;"></i>${rating}
                                    </div>
                                    <hr />
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                        <div class="price">$ ${price}</div>
                                        <button class="btn add-to-cart " data-product_id=${_id}>
                                            <i class="fa-solid fa-cart-plus" style="margin-right: 5px;"></i>Add to Cart
                                        </button>
                                    </div>
                                </div>`;

  return productCard;
}

export async function updateOrders(orderData) {
  const res = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const data = await res.json();
  console.log(data);
  return data;
}

export async function updateUserOrders(orderData, userId) {
  const res = await fetch(`http://localhost:3000/api/users/${userId}/orders`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const data = await res.json();
  console.log(data);
  return data;
}


export async function addReview(productId, reviewData) {
  const res = await fetch(
    `http://localhost:3000/api/products/${productId}/reviews`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    }
  );

  const data = await res.json()

  return data;
}