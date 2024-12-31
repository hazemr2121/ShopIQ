import { addReview, addToCart, updateWishlist } from "./../../utils/product.js";

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
var reviews_cards = document.querySelector(".reviews_content .cards");


getProductData()
    .then((data) => {

        document.querySelector(".product_page .container_content").style.display =
            "block";
        document.getElementById("loading").style.display = "none";
        console.log(data);

        let { _id, title, reviews, category, price, description, stock, discountPercentage, rating, brand, thumbnail, images } = data;

        thumbnailEle.src = thumbnail;
        images.forEach((img) => {
            var productImg = document.createElement("img");
            productImg.src = img;
            imagesContainer.appendChild(productImg);
        });

        let productThumbnail = document.querySelector(".product_page .img_column .thumbnail img");
        let productImages = document.querySelectorAll(".product_page .img_column .images img");
        productImages.forEach(img => {
            img.addEventListener("click", () => {
                console.log(img.src)
                productThumbnail.setAttribute("src", img.src);
            })
        })

        titleEle.textContent = title;
        priceEle.textContent = price;
        discountEle.textContent = discountPercentage;
        ratingEle.textContent = rating;
        brandEle.textContent = brand;
        categoryEle.textContent = category
        stockEle.textContent = stock;
        descriptionEle.textContent = description;

        console.log(reviews)
        reviews.forEach(review => {
            displayReview(review)
        })

        let review_btn = document.querySelector(".reviews_content button");
        let review_form = document.querySelector(".reviews_content .review_form");
        let form_btn = document.querySelector(".reviews_content .review_form button");

        console.log(review_form)
        if(! localStorage.getItem("user")) {
            review_form.style.display = "none";
            review_btn.style.display = "block";
            review_btn.onclick = () => {
                location.href = "/login&register/login.html";
            }
        } else {
            review_form.style.display = "block";
            review_btn.style.display = "none";
        }

        form_btn.addEventListener("click", (e) => {
            e.preventDefault();
            if( localStorage.getItem("user")) {

                let user = JSON.parse(localStorage.getItem("user"));
                const review = {
                    reviewerName: user.userName,
                    comment: document.getElementById("review-comment").value,
                    rating: +document.getElementById("rating").value
                }

                addReview( _id , review).then(res => {

                    reviews_cards.innerHTML = "";

                    res.forEach(review => {
                        displayReview(review)
                    })
                    Toastify({
                        text: "Review Added Successfully",
                        className: "info",
                    }).showToast();
                });
                console.log(review)
            }
            
        })
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
                const response = addToCart(product_data, JSON.parse(localStorage.getItem("user")).userId).then((data) => {
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

                updateWishlist(product_data, JSON.parse(localStorage.getItem("user")).userId).then((data) => {
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


console.log(reviews_cards)
function displayReview(review) {

    
    let { comment, rating, reviewerName } = review
    console.log(reviewerName)

    let reviewCard = document.createElement("div");
    reviewCard.classList.add("review_card");
    reviewCard.innerHTML = `<div class="user_details">
                                <img src="./png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png"
                                    alt="">
                                <h3>${reviewerName}</h3>
                            </div>
                            <div class="rating">
                                <i class="fa-solid fa-star" style="color: #FFD43B;"></i> ${rating}
                            </div>
                            <div class="comment">
                                ${comment}
                            </div>`

    reviews_cards.appendChild(reviewCard);
}