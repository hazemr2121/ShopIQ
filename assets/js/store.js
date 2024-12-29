import { addToCart, updateWishlist } from "./../../utils/product.js";
import Filters from "../../utils/filter.js";

async function getProducts(params) {
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
    .then((products) => {

        document.querySelector(".store_page .container_content").style.display = "flex";
        document.getElementById("loading").style.display = "none";

        let category = new URLSearchParams(window.location.search).get("category");
        let rating = new URLSearchParams(window.location.search).get("rating");
        let priceFrom = new URLSearchParams(window.location.search).get("priceFrom");
        let priceTo = new URLSearchParams(window.location.search).get("priceTo");

        
        let filteredProducts;
        var filter = new Filters(products.data);

        filteredProducts = filter.filterByCategory(category).filterByRating(rating).filterByPrice(priceFrom, priceTo).getProductsData();


        var productsContainer = document.querySelector(".store_page .products-list");
        filteredProducts.forEach((product) => {
            let { _id, title, category, price, description, discountPercentage, rating, brand, thumbnail } = product;

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

                var product_data;
                var msg;
                console.log(btn.dataset.wished)
                if(btn.dataset.wished == "false") {

                    btn.dataset.wished = "true";
                    btn.children[1].classList.toggle("active")
                    btn.children[0].classList.toggle("active")

                    product_data = {
                        action: "add",
                        id: btn.dataset.product_id
                    }
                    msg = "Product added to Wishlist Successfully";

                } else if(btn.dataset.wished == "true") {

                    btn.dataset.wished = "false";
                    btn.children[1].classList.toggle("active")
                    btn.children[0].classList.toggle("active")

                    product_data = {
                        action: "remove",
                        id: btn.dataset.product_id
                    }
                    msg = "Product removed from Wishlist Successfully";
                }

                updateWishlist(product_data , "676eba31317758c9864b3eee").then(data => {
                    Toastify({
                        text: msg,
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
        categoryItem.dataset.category = `${category}`;
        categoryList.appendChild(categoryItem);
    })

    var category_items = document.querySelectorAll(".category-item");
    category_items.forEach(item => {
        item.onclick = (e) => {
            e.stopPropagation();

            window.location.href = `store.html?category=${item.dataset.category}`;
        }
    })
})


let category_accordion = document.querySelector(".filters #category-accordion");
category_accordion.onclick = (e) => {
    category_accordion.classList.toggle("active");
};


let ratingElements = document.querySelectorAll(".filters .ratings div");
ratingElements.forEach(ele => {
    ele.onclick = () => {
        window.location.href = `store.html?rating=${ele.dataset.rating}`;
    }
})

let priceFrom = document.querySelector(".filters .price .price-from");
let priceTo = document.querySelector(".filters .price .price-to");
let priceBtn = document.querySelector(".filters .price button");

priceBtn.onclick = () => {
    window.location.href = `store.html?priceFrom=${priceFrom.value}&priceTo=${priceTo.value}`;
}
