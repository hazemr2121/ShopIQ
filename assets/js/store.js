


async function getProducts() {
    try {
        const response = await fetch("http://localhost:3000/api/products");
        const products = await response.json();

        return products;
    } catch (error) {
        console.log(error);
    }
}


document.getElementById("loading").style.display = "block";

getProducts()
    .then((data) => {
        console.log(data);

        document.querySelector(".store_page .container_content").style.display = "flex";
        document.getElementById("loading").style.display = "none";

        var productsContainer = document.querySelector(".store_page .products-list");
        data.slice(0, 9).forEach((product) => {
            let { _id, title, category, price, description, discountPercentage, rating, brand, thumbnail } = product;

            var productCard = document.createElement("div");
            productCard.className = "product_card";
            productCard.innerHTML = `<span class="badge">${discountPercentage}%</span>
                                                    <span class="wish-icon">
                                                        <i class="fa-regular fa-heart"></i>
                                                    </span>
                                                    <img src=${thumbnail} alt="product img" />
                                                    <div class="product-content">
                                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; color: #db5807;">
                                                            <div class="product-category">${category}</div>
                                                            <div class="product-brand">${brand}</div>
                                                        </div>
                                                        <a href="product_details.html?id=${_id}" class="product_link">
                                                            <div class="product-name ">${title}</div>
                                                        </a>
                                                        <div class="description">${description.substring(0, 60) + "...."}</div>
                                                        <div class="rating">
                                                            <i class="fa-solid fa-star" style="color: #FFD43B;"></i>${rating}
                                                        </div>
                                                        <hr />
                                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                                            <div class="price">$ ${price}</div>
                                                            <button class="btn add-to-cart ">
                                                                <i class="fa-solid fa-cart-plus" style="margin-right: 5px;"></i>Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>`;

            productsContainer.appendChild(productCard);
        });

    }).catch((error) => {
        console.log(error)
    })

let category_accordion = document.querySelector(".filters #category-accordion");
category_accordion.onclick = () => {
    category_accordion.classList.toggle("active");
};
