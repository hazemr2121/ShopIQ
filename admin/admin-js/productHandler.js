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
const categoryList = document.querySelectorAll(".select--category");

// Validation function
function validateProductData(productData) {
  const errors = [];

  if (!productData.title || productData.title.trim().length < 3) {
    errors.push("Title must be at least 3 characters long");
  }

  if (!productData.price || productData.price <= 0) {
    errors.push("Price must be greater than 0");
  }

  if (!productData.description || productData.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters long");
  }

  if (
    !productData.discountPercentage ||
    productData.discountPercentage < 0 ||
    productData.discountPercentage > 100
  ) {
    errors.push("Discount percentage must be between 0 and 100");
  }

  if (!productData.brand || productData.brand.trim().length < 2) {
    errors.push("Brand must be at least 2 characters long");
  }

  if (!productData.category || productData.category.trim() === "") {
    errors.push("Please select a category");
  }

  if (!productData.stock || productData.stock < 0) {
    errors.push("Stock must be 0 or greater");
  }

  return errors;
}

// Load and display categories
async function displayCategories() {
  try {
    const categories = await getAllCategories();
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
    Swal.fire({
      title: "Error!",
      text: "Failed to load categories: " + error.message,
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
  }
}

// Display all products
function displayProducts() {
  getAllProducts()
    .then((data) => {
      if (data) {
        tableBody.innerHTML = "";
        data.data.forEach((product) => {
          const row = document.createElement("tr");
          row.innerHTML = `
           <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${product.thumbnail}" alt="${product.title}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                ${product.title}
              </div>
            </td>
            <td>${product.price}</td>
            <td>${product.discountPercentage}</td>
            <td>${product.brand || "Unknown Brand"}</td>
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
        Swal.fire({
          title: "Info",
          text: "No products found.",
          icon: "info",
          confirmButtonColor: "#3085d6",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: "Error!",
        text: "Error fetching products: " + error.message,
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    });
}

// Add new product
function addNewProduct() {
  const form = document.querySelector(".add-product-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newProduct = {
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

    const validationErrors = validateProductData(newProduct);

    if (validationErrors.length > 0) {
      Swal.fire({
        title: "Validation Error",
        html: validationErrors.join("<br>"),
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const response = await addProduct(newProduct);
      Swal.fire({
        title: "Success!",
        text: "Product added successfully",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      closeModal();
      displayProducts();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add product: " + error.message,
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  });
}

// Handle product deletion
function handleDelete() {
  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = parseInt(e.target.getAttribute("data-id"));

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          await deleteProduct(productId);
          Swal.fire({
            title: "Deleted!",
            text: "Product has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          displayProducts();
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete product: " + error.message,
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    });
  });
}

// Handle product updates
function handleUpdate() {
  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = parseInt(e.target.getAttribute("data-id"));
      try {
        const product = await getProductById(productId);
        openEditModal(product);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch product details: " + error.message,
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    });
  });
}

// Open edit modal
function openEditModal(product) {
  const modal = document.getElementById("productModal");
  openModal();

  const form = document.querySelector("form");
  modal.querySelector(".modal-header h3").textContent = "Edit Product";

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

    const validationErrors = validateProductData(updatedProduct);

    if (validationErrors.length > 0) {
      Swal.fire({
        title: "Validation Error",
        html: validationErrors.join("<br>"),
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      await updateProduct(product.id, updatedProduct);
      Swal.fire({
        title: "Success!",
        text: "Product updated successfully",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      closeModal();
      displayProducts();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update product: " + error.message,
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };
}

// Modal functions
function openModal() {
  const modal = document.getElementById("productModal");
  const form = document.querySelector(".add-product-form");
  const modalTitle = modal.querySelector(".modal-header h3");

  modalTitle.textContent = "Add New Product";
  form.reset();
  form.onsubmit = addNewProduct;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("productModal");
  const form = document.querySelector(".add-product-form");
  form.reset();
  modal.style.display = "none";
}

// Event listeners
cancelBtn.addEventListener("click", () => {
  closeModal();
});

addBtn.addEventListener("click", () => {
  openModal();
});

// Initialize the application
displayCategories();
displayProducts();
addNewProduct();
handleDelete();
handleUpdate();
