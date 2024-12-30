import { addToCart, updateWishlist } from "./../../utils/product.js";

var product_id = new URLSearchParams(window.location.search).get('id');

async function getProductData() {
    try {

        const response = await fetch(`http://localhost:3000/api/products/${product_id}`);
        const product = await response.json();

        return product;
    } catch (error) {
        return error;
    }
}


var thumbnailEle = document.querySelector(".product_page .img_column .thumbnail img");
var imagesContainer = document.querySelector(".product_page .img_column .images");
var titleEle = document.querySelector(".product_page .details_column .title");
var priceEle = document.querySelector(".product_page .details_column .price span");
var discountEle = document.querySelector(".product_page .details_column .discount span");
var ratingEle = document.querySelector(".product_page .details_column .rating span");
var brandEle = document.querySelector(".product_page .details_column .brand span");
var categoryEle = document.querySelector(".product_page .details_column .category span");
var stockEle = document.querySelector(".product_page .details_column .in_stock span");
var descriptionEle = document.querySelector(".product_page .description p");

getProductData()
    .then((data) => {
        document.querySelector(".product_page .container_content").style.display =
            "block";
        document.getElementById("loading").style.display = "none";
        console.log(data);

        let { _id, title, category, price, description, stock, discountPercentage, rating, brand, thumbnail, images } = data;

        thumbnailEle.src = thumbnail;
        images.forEach((img) => {
            var productImg = document.createElement("img");
            productImg.src = img;
            imagesContainer.appendChild(productImg);
        });

        titleEle.textContent = title;
        priceEle.textContent = price;
        discountEle.textContent = discountPercentage;
        ratingEle.textContent = rating;
        brandEle.textContent = brand;
        categoryEle.textContent = category
        stockEle.textContent = stock;
        descriptionEle.textContent = description;

        const cartBtn = document.querySelector(".product_page .details_column .add-to-cart");
        cartBtn.addEventListener("click", () => {

            if (!localStorage.getItem("user")) {
                location.href = "/login&register/login.html";
            } else {
                const quantity = +document.getElementById("quantity").value;
                const product_data = {
                    product: _id,
                    quantity
                }
                const response = addToCart(product_data, "676eba31317758c9864b3eee").then((data) => {
                    Toastify({
                        text: "Product added to Cart Successfully",
                        className: "info",
                    }).showToast();
                });
            }

        })

        const wishBtn = document.querySelector(".product_page .details_column .add-to-wishlist");
        wishBtn.addEventListener("click", () => {

            if (!localStorage.getItem("user")) {
                location.href = "/login&register/login.html";
            } else {
                var product_data;
                var msg;
                if (wishBtn.dataset.wished === "false") {
                    wishBtn.dataset.wished = "true";
                    wishBtn.innerHTML = `<i class="fa-solid fa-heart-crack"></i> Remove from Wishlist`;

                    product_data = {
                        action: "add",
                        id: _id,
                    }
                    msg = "Product added to Wishlist Successfully";
                } else if (wishBtn.dataset.wished === "true") {
                    wishBtn.dataset.wished = "false";
                    wishBtn.innerHTML = `<i class="fa-regular fa-heart"></i> Add to Wishlist`;

                    product_data = {
                        action: "remove",
                        id: _id,
                    }
                    msg = "Product removed from Wishlist Successfully";
                }

                updateWishlist(product_data, "676eba31317758c9864b3eee").then((data) => {
                    Toastify({
                        text: msg,
                        className: "info",
                    }).showToast();
                })
            }


        })
    })
    .catch((error) => {
        console.log(error);
    })


