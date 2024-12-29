import {
  getAllProducts,
  addProduct,
  deleteProduct,
  getProductById,
  updateProduct,
  getAllCategories,
} from "./productManager.js";

const tableBody = document.querySelector(".table--body");

const saveBtn = document.querySelector(".btn-save");
const cancelBtn = document.querySelector(".btn-cancel");
const addBtn = document.querySelector(".add-btn");

cancelBtn.addEventListener("click", () => {
  closeModal();
});

addBtn.addEventListener("click", () => {
  openModal();
});
const categoryList = document.querySelectorAll(".select--category");
async function displayCategories() {
  try {
    const categories = await getAllCategories();
    // const selectElements = document.querySelectorAll('select[name="category"]');

    categoryList.forEach((select) => {
      select.innerHTML = '<option value="">Select Category</option>';
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
      });
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}
displayCategories();

function displayProducts() {
  getAllProducts()
    .then((data) => {
      if (data) {
        console.log(data);
        // Clear the existing table body (if needed)
        tableBody.innerHTML = "";

        // Populate the table with product data
        data.forEach((product) => {
          const row = document.createElement("tr");

          // Assuming product has properties: id, name, price
          row.innerHTML = `
           <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${product.thumbnail}" alt="${
            product.name
          }" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                ${product.title}
              </div>
            </td>
            <td>${product.price}</td>
            <td>${product.discountPercentage}</td>
            <td>${product.brand || "Un Known Brand"}</td>
               <td>${product.category}</td>
                  <td>${product.stock}</td>
                     <td>${product.rating}</td>
                <td class="action-buttons">
              <button class="edit" data-id=${product.id}>Edit</button>
              <button class="delete" data-id=${product.id}>Delete</button>
            </td>
          `;

          tableBody.appendChild(row);
        });

        handleDelete();
        handleUpdate();
      } else {
        console.log("No products found.");
      }
    })
    .catch((error) => {
      console.log("Error fetching products:", error);
    });
}

displayProducts();

function addNewProduct() {
  const form = document.querySelector(".add-product-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = form.querySelector("input[type='text']").value;
    const price = form.querySelector("input[type='number'][step]").value;
    const description = form.querySelector("textarea").value;
    const discount = form.querySelector("input[type='number'][min]").value;
    const brand = form.querySelector("input[type='text']").value;
    const category = form.querySelector("select").value;
    const stock = form.querySelector("input[type='number'][min]").value;

    const images = form.querySelector("input[type='file'][multiple]").files;
    const thumbnail = form.querySelector("input[type='file']:not([multiple])")
      .files[0];

    const newProduct = {
      title: title,
      price: parseFloat(price),
      description: description,
      discountPercentage: parseInt(discount),
      brand: brand,
      category: category,
      stock: parseInt(stock),
    };

    console.log(newProduct);

    try {
      const response = await addProduct(newProduct);
      console.log("Product added:", response);

      closeModal();
      displayProducts();
    } catch (error) {
      console.log("Error adding product:", error);
    }
  });
}

addNewProduct();

function handleDelete() {
  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = e.target.getAttribute("data-id");

      console.log(productId);
      const id = parseInt(productId);

      try {
        const response = await deleteProduct(id);
        console.log("Product deleted:", response);

        displayProducts();
      } catch (error) {
        console.log("Error deleting product:", error);
      }
    });
  });
}
handleDelete();

function handleUpdate() {
  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = e.target.getAttribute("data-id");

      const id = parseInt(productId);
      const product = await getProductById(id);
      console.log(product);
      openEditModal(product);
    });
  });
}
handleUpdate();

function openEditModal(product) {
  const modal = document.getElementById("productModal");
  openModal();

  const form = document.querySelector("form");

  // Update form title
  modal.querySelector(".modal-header h3").textContent = "Edit Product";

  // Update form fields
  form.querySelector("input[name='title']").value = product.title;
  form.querySelector("input[name='price']").value = product.price;
  form.querySelector("textarea[name='description']").value =
    product.description;
  form.querySelector("input[name='discount']").value =
    product.discountPercentage;
  form.querySelector("input[name='brand']").value = product.brand;
  form.querySelector("select[name='category']").value = product.category;
  form.querySelector("input[name='stock']").value = product.stock;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      title: form.querySelector("input[name='title']").value,
      price: parseFloat(form.querySelector("input[name='price']").value),
      description: form.querySelector("textarea[name='description']").value,
      discountPercentage: parseInt(
        form.querySelector("input[name='discount']").value
      ),
      brand: form.querySelector("input[name='brand']").value,
      category: form.querySelector("select[name='category']").value,
      stock: parseInt(form.querySelector("input[name='stock']").value),
    };

    try {
      const response = await updateProduct(product.id, updatedProduct);
      console.log("Product updated:", response);
      closeModal();
      displayProducts();
    } catch (error) {
      console.log("Error updating product:", error);
    }
  };
}

function openModal() {
  const modal = document.getElementById("productModal");
  const form = document.querySelector(".add-product-form");
  const modalTitle = modal.querySelector(".modal-header h3");

  // Reset form and title for add mode
  modalTitle.textContent = "Add New Product";
  form.reset();

  // Reset to default add product submission handler
  form.onsubmit = addNewProduct;

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("productModal");
  const form = document.querySelector(".add-product-form");
  form.reset();
  modal.style.display = "none";
}
