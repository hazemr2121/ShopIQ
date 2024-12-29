import { addToCart, updateWishlist, createProductEle, getProducts, paginate, createPaginationBtns } from "./../../utils/product.js";
import Filters from "../../utils/filter.js";




document.getElementById("loading").style.display = "block";
var productsContainer = document.querySelector(".store_page .products-list");
var productsLength = document.querySelector(".store_page .product-count span");
let paginationParent = document.querySelector(".pagination");

var productsData = []
getProducts()
    .then((res) => {

        document.querySelector(".store_page .container_content").style.display = "flex";
        document.getElementById("loading").style.display = "none";

        // let category = new URLSearchParams(window.location.search).get("category");
        // let rating = new URLSearchParams(window.location.search).get("rating");
        // let priceFrom = new URLSearchParams(window.location.search).get("priceFrom");
        // let priceTo = new URLSearchParams(window.location.search).get("priceTo");


        // let filteredProducts;
        // var filter = new Filters(products.data);

        // filteredProducts = filter.filterByCategory(category).filterByRating(rating).filterByPrice(priceFrom, priceTo).getProductsData();
        // let filteredProducts = category ? res.data.filter(product => product.category == category) : res.data

        productsData = res.data
        // console.log(productsData)
        productsLength.innerHTML = res.length
        productsData.slice(0, 9).forEach((product) => {

            const productCard = createProductEle(product)

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
                if (btn.dataset.wished == "false") {

                    btn.dataset.wished = "true";
                    btn.children[1].classList.toggle("active")
                    btn.children[0].classList.toggle("active")

                    product_data = {
                        action: "add",
                        id: btn.dataset.product_id
                    }
                    msg = "Product added to Wishlist Successfully";

                } else if (btn.dataset.wished == "true") {

                    btn.dataset.wished = "false";
                    btn.children[1].classList.toggle("active")
                    btn.children[0].classList.toggle("active")

                    product_data = {
                        action: "remove",
                        id: btn.dataset.product_id
                    }
                    msg = "Product removed from Wishlist Successfully";
                }

                updateWishlist(product_data, "676eba31317758c9864b3eee").then(data => {
                    Toastify({
                        text: msg,
                        className: "info",
                    }).showToast();
                })
            })
        })


        // create pagination btns
        createPaginationBtns(paginationParent, productsData.length)

        var pageBtns = document.querySelectorAll(".pagination button");
        pageBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                console.log(btn.dataset.page)

                productsData = paginate(res.data, btn.dataset.page)
                productsContainer.innerHTML = "";
                productsLength.innerHTML = productsData.length;

                productsData.forEach((product) => {
                    let productCard = createProductEle(product);
                    productsContainer.appendChild(productCard)
                })
                window.scrollTo(0, 0);
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

            getProducts(`http://localhost:3000/api/products?category=${item.dataset.category}`).then(res => {

                productsContainer.innerHTML = "";
                productsLength.innerHTML = res.length;
                productsData = res.data
                createPaginationBtns(paginationParent, productsData.length)
                productsData.forEach((product) => {
                    let productCard = createProductEle(product);
                    productsContainer.appendChild(productCard)
                })

                var pageBtns = document.querySelectorAll(".pagination button");
                pageBtns.forEach(btn => {
                    btn.addEventListener("click", () => {
                        console.log(btn.dataset.page)

                        productsData = paginate(res.data, btn.dataset.page)
                        console.log(productsData)
                        productsContainer.innerHTML = "";
                        productsLength.innerHTML = productsData.length;

                        productsData.forEach((product) => {
                            let productCard = createProductEle(product);
                            productsContainer.appendChild(productCard)
                        })
                        window.scrollTo(0, 0);
                    })
                })
            })
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
        getProducts(`http://localhost:3000/api/products?rating=${ele.dataset.rating}`).then(res => {
            productsContainer.innerHTML = "";
            productsLength.innerHTML = res.length;
            productsData = res.data
            createPaginationBtns(paginationParent, productsData.length)

            productsData.slice(0, 9).forEach(product => {
                let productCard = createProductEle(product);
                productsContainer.appendChild(productCard)
            })

            var pageBtns = document.querySelectorAll(".pagination button");
            pageBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    console.log(btn.dataset.page)

                    productsData = paginate(res.data, btn.dataset.page)
                    console.log(productsData)
                    productsContainer.innerHTML = "";
                    productsLength.innerHTML = productsData.length;

                    productsData.forEach((product) => {
                        let productCard = createProductEle(product);
                        productsContainer.appendChild(productCard)
                    })
                    window.scrollTo(0, 0);
                })
            })
        })
    }
})

let priceFrom = document.querySelector(".filters .price .price-from");
let priceTo = document.querySelector(".filters .price .price-to");
let priceBtn = document.querySelector(".filters .price button");

priceBtn.onclick = () => {

    getProducts(`http://localhost:3000/api/products?priceFrom=${priceFrom.value}&priceTo=${priceTo.value}`).then(res => {
        console.log(res)
        productsContainer.innerHTML = "";
        productsLength.innerHTML = res.length;
        productsData = res.data
        createPaginationBtns(paginationParent, productsData.length)
        productsData.slice(0 , 9).forEach(product => {
            let productCard = createProductEle(product);
            productsContainer.appendChild(productCard)
        })

        var pageBtns = document.querySelectorAll(".pagination button");
        pageBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                console.log(btn.dataset.page)

                productsData = paginate(res.data, btn.dataset.page)
                console.log(productsData)
                productsContainer.innerHTML = "";
                productsLength.innerHTML = productsData.length;

                productsData.forEach((product) => {
                    let productCard = createProductEle(product);
                    productsContainer.appendChild(productCard)
                })
                window.scrollTo(0, 0);
            })
        })
    })
}
