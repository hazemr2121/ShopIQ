import { addToCart, addToWishlist } from "./../../utils/product.js";


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
            productCard.innerHTML = `<span class="product_badge">${discountPercentage}%</span>
                                                    <span class="wish-icon" data-product_id=${_id}>
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
                                                        <div class="description">${description.substring(0, 60) + "...."}</div>
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

            productsContainer.appendChild(productCard);
        });

        var cartBtns = document.querySelectorAll(".add-to-cart");
        cartBtns.forEach((btn) => {
            btn.addEventListener("click", () => {

                addToCart({ product: btn.dataset.product_id }, "676eba31317758c9864b3eee")
                    .then(res => {

                        Toastify({
                            text: "Product added to Cart Successfully",
                            className: "info",
                        }).showToast();
                    })



            })
        })

        var wishBtns = document.querySelectorAll(".wish-icon");
        wishBtns.forEach(btn => {
            btn.addEventListener("click", () => {

                addToWishlist({ id: btn.dataset.product_id }, "676eba31317758c9864b3eee")
                    .then(res => {

                        btn.children[1].classList.toggle("active")
                        btn.children[0].classList.toggle("active")
                        Toastify({
                            text: "Product added to Wishlist Successfully",
                            className: "info",
                        }).showToast();
                    })
            })
        })

    }).catch((error) => {
        console.log(error)
    })

async function getCategories() {
    const response = await fetch("http://localhost:3000/api/categories")
    const data = await response.json();
    return data;
}

getCategories().then(data => {
    var categoryList = document.querySelector(".filters #category-accordion .categories");
    data.forEach(category => {
        var categoryItem = document.createElement("p");
        categoryItem.className = "category-item";
        categoryItem.innerHTML = `${category}`;
        categoryList.appendChild(categoryItem);
    })
})


let category_accordion = document.querySelector(".filters #category-accordion");
category_accordion.onclick = () => {
    category_accordion.classList.toggle("active");
};
