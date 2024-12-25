var product_id = new URLSearchParams(window.location.search).get('id');

async function getProductData() {
    try {

        const response = await fetch(`http://localhost:3000/api/products/${product_id}`);
        const product = await response.json();

        return product;
    } catch(error) {
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

getProductData()
    .then((data) => {
        console.log(data);

        let { _id, title, category, price, description, stock ,discountPercentage, rating, brand, thumbnail , images } = data;

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
    })
    .catch((error) => {
        console.log(error);
    })