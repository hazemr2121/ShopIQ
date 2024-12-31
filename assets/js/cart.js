document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = user ? user.cart : [];
  console.log(cart);
  const itemsContainer = document.getElementById("items-container");
  const totalPriceElement = document.getElementById("total-price");
  let totalPrice = 0;

  itemsContainer.innerHTML = ""; // Clear existing items

  if (cart.length === 0) {
    itemsContainer.innerHTML =
      "<div class='flex justify-center items-center h-96'><p class='text-center font-bold'>You have nothing in your cart</p></div>";
  } else {
    cart.forEach((cartItem, index) => {
      const item = cartItem.product;
      const quantity = cartItem.quantity;
      const itemElement = document.createElement("div");
      itemElement.classList.add(
        "flex",
        "flex-col",
        "md:flex-row",
        "items-start",
        "p-2",
        "md:p-6",
        "mb-4"
      );
      itemElement.innerHTML = `
      <div class="w-full lg:max-w-[150px] rounded-xl mr-4 md:mr-6 mb-4 lg:mb-0">
        <a href="../../product_details.html?id=${item._id}">
          <img src="${item.thumbnail}" alt="${item.title}" class="max-w-full h-auto rounded-xl mx-auto" />
        </a>
      </div>
      <div class="flex">
        <div>
          <div class="text-base md:text-lg hover:text-blue-600 mb-4">
            <a href="../../product_details.html?id=${item._id}">${item.title}</a>
          </div>
          <div>
            <div class="flex h-11 w-24 mb-4">
              <input type="number" class="w-2/3 pl-2 text-center border border-black bg-transparent focus:outline-none rounded-lg overflow-hidden" placeholder="" value="${quantity}" />
              <div class="w-1/3 border border-black rounded-lg overflow-hidden flex flex-col bg-transparent p-0">
                <button class="text-[12px] hover:bg-blue-600 hover:text-white h-1/2" id="plus" data-productId=${item._id} type="button">
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button class="text-[12px] hover:bg-blue-600 hover:text-white h-1/2" id="minus" data-productId=${item._id} type="button">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>
            <h3 class="text-xl font-bold text-blue-600">$${item.price}</h3>
          </div>
        </div>
        <div>
          <button class="w-10 h-10 hover:bg-blue-200 inline-flex justify-center items-center rounded-full delete-btn" data-index="${index}" data-productid="${item._id}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
      itemsContainer.appendChild(itemElement);
      totalPrice += item.price * quantity;
    });

    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

    const plus = document.getElementById("plus");
    const minus = document.getElementById("minus");
    plus.addEventListener("click", async (event) => {
      console.log(plus.dataset.productid);
      // const productId = localStorage.getItem("user").cart.product.id;

      try {
        const response = await fetch(
          `http://localhost:3000/api/users/${user.userId}/cart`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product: plus.dataset.productid,
              action: "plus",
            }),
          }
        );

        const updatedUserResponse = await fetch(
          `http://localhost:3000/api/users/${user.userId}`
        );
        if (updatedUserResponse.ok) {
          const updatedUser = await updatedUserResponse.json();
          const userData = {
            userId: updatedUser._id,
            userName: updatedUser.username,
            address: updatedUser.address,
            phone: updatedUser.phone,
            orders: updatedUser.orders,
            role: updatedUser.role,
            wishList: updatedUser.wishlist,
            email: updatedUser.email,
            cart: updatedUser.cart,
            createdAt: new Date(updatedUser.createdAt).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            ),
          };
          localStorage.setItem("user", JSON.stringify(userData));
          renderItems(updatedUser.cart);
        } else {
          console.error("Failed to fetch updated user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
    // minus

    minus.addEventListener("click", async (event) => {
      console.log(minus.dataset.productid);
      // const productId = localStorage.getItem("user").cart.product.id;

      try {
        const response = await fetch(
          `http://localhost:3000/api/users/${user.userId}/cart`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product: minus.dataset.productid,
              action: "minus",
            }),
          }
        );

        const updatedUserResponse = await fetch(
          `http://localhost:3000/api/users/${user.userId}`
        );
        if (updatedUserResponse.ok) {
          const updatedUser = await updatedUserResponse.json();
          const userData = {
            userId: updatedUser._id,
            userName: updatedUser.username,
            address: updatedUser.address,
            phone: updatedUser.phone,
            orders: updatedUser.orders,
            role: updatedUser.role,
            wishList: updatedUser.wishlist,
            email: updatedUser.email,
            cart: updatedUser.cart,
            createdAt: new Date(updatedUser.createdAt).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            ),
          };
          localStorage.setItem("user", JSON.stringify(userData));
          renderItems(updatedUser.cart);
        } else {
          console.error("Failed to fetch updated user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

    // Add event listener for delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        console.log(button.dataset.productid);
        const index = event.currentTarget.getAttribute("data-index");
        console.log(localStorage.getItem("user").cart);
        // const productId = localStorage.getItem("user").cart.product.id;

        try {
          const response = await fetch(
            `http://localhost:3000/api/users/${user.userId}/deleteFromCart`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: button.dataset.productid }),
            }
          );

          const updatedUserResponse = await fetch(
            `http://localhost:3000/api/users/${user.userId}`
          );
          if (updatedUserResponse.ok) {
            const updatedUser = await updatedUserResponse.json();
            const userData = {
              userId: updatedUser._id,
              userName: updatedUser.username,
              address: updatedUser.address,
              phone: updatedUser.phone,
              orders: updatedUser.orders,
              role: updatedUser.role,
              wishList: updatedUser.wishlist,
              email: updatedUser.email,
              cart: updatedUser.cart,
              createdAt: new Date(updatedUser.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              ),
            };
            localStorage.setItem("user", JSON.stringify(userData));
            renderItems(updatedUser.cart);
          } else {
            console.error("Failed to fetch updated user data");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
    });
  }

  function renderItems(items) {
    itemsContainer.innerHTML = "";
    totalPrice = 0;
    if (items.length === 0) {
      itemsContainer.innerHTML =
        "<div class='flex justify-center items-center h-96'><p class='text-center font-bold'>You have nothing in your cart</p></div>";
    } else {
      items.forEach((cartItem, index) => {
        const item = cartItem.product;
        const quantity = cartItem.quantity;
        const itemElement = document.createElement("div");
        itemElement.classList.add(
          "flex",
          "flex-col",
          "md:flex-row",
          "items-start",
          "p-2",
          "md:p-6",
          "mb-4"
        );
        itemElement.innerHTML = `
        <div class="w-full lg:max-w-[150px] rounded-xl mr-4 md:mr-6 mb-4 lg:mb-0">
          <a href="#!">
            <img src="${item.thumbnail}" alt="${item.title}" class="max-w-full h-auto rounded-xl mx-auto" />
          </a>
        </div>
        <div class="flex">
          <div>
            <div class="text-base md:text-lg hover:text-blue-600 mb-4">
              <a href="../../product_details.html?id=${item._id}">${item.title}</a>
            </div>
            <div>
              <div class="flex h-11 w-24 mb-4">
                <input type="number" class="w-2/3 pl-2 text-center border border-black bg-transparent focus:outline-none rounded-lg overflow-hidden" placeholder="" value="${quantity}" />
                <div class="w-1/3 border border-black rounded-lg overflow-hidden flex flex-col bg-transparent p-0">
                  <button class="text-[12px] hover:bg-blue-600 hover:text-white h-1/2" id="plus" data-productId=${item._id} type="button">
                    <i class="fas fa-chevron-up"></i>
                  </button>
                  <button class="text-[12px] hover:bg-blue-600 hover:text-white h-1/2" id="minus"data-productId=${item._id} type="button">
                    <i class="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
              <h3 class="text-xl font-bold text-blue-600">$${item.price}</h3>
            </div>
          </div>
          <div>
            <button class="w-10 h-10 hover:bg-blue-200 inline-flex justify-center items-center rounded-full delete-btn" data-index="${index}" data-productid="${item._id}">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      `;
        itemsContainer.appendChild(itemElement);
        totalPrice += item.price * quantity;
      });
      totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

      const plus = document.getElementById("plus");
      const minus = document.getElementById("minus");
      plus.addEventListener("click", async (event) => {
        console.log(plus.dataset.productid);
        // const productId = localStorage.getItem("user").cart.product.id;

        try {
          const response = await fetch(
            `http://localhost:3000/api/users/${user.userId}/cart`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product: plus.dataset.productid,
                action: "plus",
              }),
            }
          );

          const updatedUserResponse = await fetch(
            `http://localhost:3000/api/users/${user.userId}`
          );
          if (updatedUserResponse.ok) {
            const updatedUser = await updatedUserResponse.json();
            const userData = {
              userId: updatedUser._id,
              userName: updatedUser.username,
              address: updatedUser.address,
              phone: updatedUser.phone,
              orders: updatedUser.orders,
              role: updatedUser.role,
              wishList: updatedUser.wishlist,
              email: updatedUser.email,
              cart: updatedUser.cart,
              createdAt: new Date(updatedUser.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              ),
            };
            localStorage.setItem("user", JSON.stringify(userData));
            renderItems(updatedUser.cart);
          } else {
            console.error("Failed to fetch updated user data");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
      // minus

      minus.addEventListener("click", async (event) => {
        console.log(minus.dataset.productid);
        // const productId = localStorage.getItem("user").cart.product.id;

        try {
          const response = await fetch(
            `http://localhost:3000/api/users/${user.userId}/cart`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product: minus.dataset.productid,
                action: "minus",
              }),
            }
          );

          const updatedUserResponse = await fetch(
            `http://localhost:3000/api/users/${user.userId}`
          );
          if (updatedUserResponse.ok) {
            const updatedUser = await updatedUserResponse.json();
            const userData = {
              userId: updatedUser._id,
              userName: updatedUser.username,
              address: updatedUser.address,
              phone: updatedUser.phone,
              orders: updatedUser.orders,
              role: updatedUser.role,
              wishList: updatedUser.wishlist,
              email: updatedUser.email,
              cart: updatedUser.cart,
              createdAt: new Date(updatedUser.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              ),
            };
            localStorage.setItem("user", JSON.stringify(userData));
            renderItems(updatedUser.cart);
          } else {
            console.error("Failed to fetch updated user data");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
          console.log(button.dataset.productid);
          const index = event.currentTarget.getAttribute("data-index");
          console.log(localStorage.getItem("user").cart);
          // const productId = localStorage.getItem("user").cart.product.id;

          try {
            const response = await fetch(
              `http://localhost:3000/api/users/${user.userId}/deleteFromCart`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: button.dataset.productid }),
              }
            );

            const updatedUserResponse = await fetch(
              `http://localhost:3000/api/users/${user.userId}`
            );
            if (updatedUserResponse.ok) {
              const updatedUser = await updatedUserResponse.json();
              const userData = {
                userId: updatedUser._id,
                userName: updatedUser.username,
                address: updatedUser.address,
                phone: updatedUser.phone,
                orders: updatedUser.orders,
                role: updatedUser.role,
                wishList: updatedUser.wishlist,
                email: updatedUser.email,
                cart: updatedUser.cart,
                createdAt: new Date(updatedUser.createdAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                ),
              };
              localStorage.setItem("user", JSON.stringify(userData));
              renderItems(updatedUser.cart);
            } else {
              console.error("Failed to delete item from cart");
            }
          } catch (error) {
            console.error("Error:", error);
          }
        });
      });
    }
  }
});
