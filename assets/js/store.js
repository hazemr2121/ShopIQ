import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


const firebaseConfig = {
    databaseURL:
        "https://store-ec3ce-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
console.log(app);

var productsData = [];

const db = getDatabase();
const productsRef = ref(db, "products");
onValue(productsRef, (snapshot) => {
    productsData = snapshot.val();

    var productsContainer = document.querySelector(".store_page .products-list");
    console.log(productsContainer);
    if (productsData.length === 0) {
        document.getElementById("loading").style.display = "block";

    } else {
        document.querySelector(".store_page .container_content").style.display = "flex";
        document.getElementById("loading").style.display = "none";

        productsData.slice(10, 19).forEach((product) => {
            let { name, category, price, description, discountPercentage, rating, stock_quantity, reviews, brand, thumbnail } = product;

            var productCard = document.createElement("div");
            productCard.className = "product_card";
            productCard.innerHTML = `<span class="badge">20%</span>
                                    <span class="wish-icon">
                                        <i class="fa-regular fa-heart"></i>
                                    </span>
                                    <img src=${product.thumbnail} alt="product img" />
                                    <div class="product-content">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; color: #db5807;">
                                            <div class="product-category">${product.category}</div>
                                            <div class="product-brand">${product.brand}</div>
                                        </div>
                                        <a href="" class="product_link">
                                            <div class="product-name ">${product.name}</div>
                                        </a>
                                        <div class="description">${product.description.substring(0, 60) + "...."}</div>
                                        <div class="rating">
                                            <i class="fa-solid fa-star" style="color: #FFD43B;"></i>${product.rating}
                                        </div>
                                        <hr />
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                            <div class="price">$ ${product.price}</div>
                                            <button class="btn add-to-cart ">
                                                <i class="fa-solid fa-cart-plus" style="margin-right: 5px;"></i>Add to Cart
                                            </button>
                                        </div>
                                    </div>`;

            productsContainer.appendChild(productCard);
        });

    }

    console.log(productsData.slice(10, 19)[0]);
});