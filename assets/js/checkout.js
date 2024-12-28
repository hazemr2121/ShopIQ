fetch("http://localhost:3000/api/orders")
  .then((response) => response.json())
  .then((data) => {
    const itemsContainer = document.getElementById("items-container");
    const totalPriceElement = document.getElementById("total-price");
    let totalPrice = 0;

    itemsContainer.innerHTML = ""; // Clear existing items

    if (data[0].items.length === 0) {
      itemsContainer.innerHTML =
        "<div class='flex justify-center items-center h-96'><p class='text-center font-bold'>You have nothing in your cart</p></div>";
    } else {
      data[0].items.forEach((item, index) => {
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
              <a href="#!">${item.title}</a>
            </div>
            <div>
              <div class="flex h-11 w-24 mb-4">
                <input type="number" class="w-2/3 pl-2 text-center border border-black bg-transparent focus:outline-none rounded-lg overflow-hidden" placeholder="" value="1" />
                <div class="w-1/3 border border-black rounded-lg overflow-hidden flex flex-col bg-transparent p-0">
                  <button class="text-[12px] hover:bg-blue-600 hover:text-white h-1/2" type="button">
                    <i class="fas fa-chevron-up"></i>
                  </button>
                  <button class="text-[12px] hover:bg-blue-600 hover:text-white h-1/2" type="button">
                    <i class="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
              <h3 class="text-xl font-bold text-blue-600">$${item.price}</h3>
            </div>
          </div>
          <div>
            <button class="w-10 h-10 hover:bg-blue-200 inline-flex justify-center items-center rounded-full delete-btn" data-index="${index}">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      `;
        itemsContainer.appendChild(itemElement);
        totalPrice += item.price;
      });

      totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

      // Add event listener for delete buttons
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = event.currentTarget.getAttribute("data-index");
          data[0].items.splice(index, 1); // Remove item from data
          renderItems(data[0].items); // Re-render items
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
        items.forEach((item, index) => {
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
                <a href="#!">${item.title}</a>
              </div>
              <div>
                <div class="flex h-11 w-24 mb-4">
                  <input type="number" class="w-2/3 pl-2 text-center border border-black bg-transparent focus:outline-none rounded-lg overflow-hidden" placeholder="" value="1" />
                  <div class="w-1/3 border border-black rounded-lg overflow-hidden flex flex-col bg-transparent p-0">
                    <button class="text-[12px] hover:bg-blue-600 hover:text-white h-1/2" type="button">
                      <i class="fas fa-chevron-up"></i>
                    </button>
                    <button class="text-[12px] hover:bg-blue-600 hover:text-white h-1/2" type="button">
                      <i class="fas fa-chevron-down"></i>
                    </button>
                  </div>
                </div>
                <h3 class="text-xl font-bold text-blue-600">$${item.price}</h3>
              </div>
            </div>
            <div>
              <button class="w-10 h-10 hover:bg-blue-200 inline-flex justify-center items-center rounded-full delete-btn" data-index="${index}">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        `;
          itemsContainer.appendChild(itemElement);
          totalPrice += item.price;
        });
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

        // Re-add event listeners for new delete buttons
        document.querySelectorAll(".delete-btn").forEach((button) => {
          button.addEventListener("click", (event) => {
            const index = event.currentTarget.getAttribute("data-index");
            items.splice(index, 1); // Remove item from items
            renderItems(items); // Re-render items
          });
        });
      }
    }
  })
  .catch((error) => console.error("Error fetching orders:", error));
