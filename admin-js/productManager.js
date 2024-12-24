import Database from "./database.js";

const ProductManager = {
  productList: document.getElementById("product-list"),
  productForm: document.getElementById("productForm"),
  currentProductId: null,

  init: function () {
    this.productForm.style.display = "none";

    // Add this line to get the button reference
    const addProductBtn = document.querySelector("#addProductBtn");
    if (addProductBtn) {
      addProductBtn.addEventListener("click", () => {
        this.showProductForm("Add New Product");
      });
    }

    this.attachEventListeners();
    this.loadProducts();
    this.setupFormValidation();

    document
      .querySelector('[data-page="products"]')
      .addEventListener("click", () => {
        this.loadProducts();
      });
  },

  setupFormValidation: function () {
    const form = this.productForm.querySelector("form");

  
    form.querySelectorAll("input, textarea").forEach((input) => {
      input.removeAttribute("required");
    });

    // Handle form submission
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.validateForm(form)) {
        if (this.currentProductId) {
          this.handleProductUpdate(event);
        } else {
          this.handleProductSubmit(event);
        }
      }
    });

    // Close form on escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.productForm.style.display === "flex") {
        this.hideProductForm();
        this.resetForm();
      }
    });
  },

  validateForm: function (form) {
    const validationRules = [
      {
        name: "productName",
        label: "Product Name",
        minLength: 3,
        maxLength: 100,
        required: true,
      },
      {
        name: "category",
        label: "Category",
        required: true,
      },
      {
        name: "price",
        label: "Price",
        required: true,
        min: 0,
      },
      {
        name: "description",
        label: "Description",
        minLength: 10,
        maxLength: 500,
      },
      {
        name: "stock",
        label: "Stock Quantity",
        required: true,
        min: 0,
      },
      {
        name: "brand",
        label: "Brand",
        required: true,
      },
    ];

    let isValid = true;
    let errors = [];

    validationRules.forEach((field) => {
      const input = form[field.name];
      const value = input.value.trim();

      // Reset error state
      input.classList.remove("error");

      // Check required fields
      if (field.required) {
        if (!this.currentProductId && !value) {
          errors.push(`${field.label} is required`);
          isValid = false;
          input.classList.add("error");
          return;
        }
      }

      // Skip further validation if field is empty and not required
      if (!value && !field.required) return;

      // Check minimum length
      if (field.minLength && value.length < field.minLength) {
        errors.push(
          `${field.label} must be at least ${field.minLength} characters long`
        );
        isValid = false;
        input.classList.add("error");
      }

      // Check maximum length
      if (field.maxLength && value.length > field.maxLength) {
        errors.push(
          `${field.label} must be less than ${field.maxLength} characters long`
        );
        isValid = false;
        input.classList.add("error");
      }

      // Check minimum value for numbers
      if (field.min !== undefined && value !== "") {
        const numValue = parseFloat(value);
        if (numValue < field.min) {
          errors.push(`${field.label} cannot be less than ${field.min}`);
          isValid = false;
          input.classList.add("error");
        }
      }
    });

    if (!isValid) {
      this.showError(errors.join("\n"));
    }

    return isValid;
  },

  attachEventListeners: function () {
    // Handle delete buttons
    this.productList.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-delete")) {
        this.handleDelete(event);
      } else if (event.target.classList.contains("btn-edit")) {
        this.handleEdit(event);
      }
    });

    // Handle form close button
    this.productForm
      .querySelector(".close-btn")
      .addEventListener("click", () => {
        this.hideProductForm();
        this.resetForm();
      });

    // Handle cancel button
    this.productForm
      .querySelector('button[type="button"]')
      .addEventListener("click", () => {
        this.hideProductForm();
        this.resetForm();
      });
  },

  loadProducts: function () {
    this.productList.innerHTML =
      '<tr><td colspan="5" class="text-center">Loading products...</td></tr>';

    Database.fetchProducts(
      (products) => {
        this.displayProducts(products);
      },
      (error) => {
        console.error("Error loading products:", error);
        this.productList.innerHTML =
          '<tr><td colspan="5" class="text-center text-error">Error loading products</td></tr>';
        this.showError("Failed to load products. Please try again.");
      }
    );
  },

  displayProducts: function (products) {
    this.productList.innerHTML = "";

    if (Object.keys(products).length === 0) {
      this.productList.innerHTML =
        '<tr><td colspan="5" class="text-center">No products found</td></tr>';
      return;
    }

    Object.keys(products).forEach((key) => {
      const product = products[key];
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${this.escapeHtml(product.name)}</td>
        <td>${this.escapeHtml(product.brand)}</td>
        <td>$${parseFloat(product.price).toFixed(2)}</td>
        <td>${product.stock_quantity}</td>
        <td>
          <button class="btn btn-edit" data-id="${key}">Edit</button>
          <button class="btn btn-delete" data-id="${key}">Delete</button>
        </td>
      `;

      this.productList.appendChild(row);
    });
  },

  handleDelete: function (event) {
    const productId = event.target.getAttribute("data-id");

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Database.deleteProduct(
          productId,
          () => {
            Swal.fire("Deleted!", "Product has been deleted.", "success");
            this.loadProducts();
          },
          (error) => {
            console.error("Error deleting product:", error);
            this.showError("Failed to delete product");
          }
        );
      }
    });
  },

  handleEdit: function (event) {
    const productId = event.target.getAttribute("data-id");

    Database.fetchProducts(
      (products) => {
        const product = products[productId];
        if (product) {
          this.fillFormWithProduct(product, productId);
          this.showProductForm("Edit Product");
        } else {
          this.showError("Product not found");
        }
      },
      (error) => {
        console.error("Error fetching product:", error);
        this.showError("Failed to fetch product details");
      }
    );
  },

  fillFormWithProduct: function (product, productId) {
    const form = this.productForm.querySelector("form");
    const fields = [
      { key: "name", id: "productName" },
      { key: "category", id: "category" },
      { key: "price", id: "price" },
      { key: "description", id: "description" },
      { key: "discountPercentage", id: "discountPercentage" },
      { key: "stock_quantity", id: "stock" },
      { key: "brand", id: "brand" },
      { key: "thumbnail", id: "thumbnail" },
    ];

    fields.forEach((field) => {
      const input = form[field.id];
      const value = product[field.key];
      input.value = value || "";
      input.setAttribute("data-had-value", value ? "true" : "false");
      input.classList.remove("error");
    });

    // Handle images array
    form.images.value = product.images ? product.images.join(", ") : "";
    form.images.setAttribute(
      "data-had-value",
      product.images && product.images.length ? "true" : "false"
    );

    this.currentProductId = productId;

    // Update form title and submit button
    this.productForm.querySelector(".form-header h3").textContent =
      "Edit Product";
    form.querySelector('button[type="submit"]').textContent = "Update Product";
  },

  handleProductSubmit: function (event) {
    const form = event.target;
    const productData = this.getProductDataFromForm(form);

    Database.addProduct(
      productData,
      () => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product added successfully",
        });
        this.resetForm();
        this.hideProductForm();
        this.loadProducts();
      },
      (error) => {
        console.error("Error adding product:", error);
        this.showError("Failed to add product");
      }
    );
  },

  handleProductUpdate: function (event) {
    const form = event.target;
    const productData = this.getProductDataFromForm(form);

    Database.updateProduct(
      this.currentProductId,
      productData,
      () => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product updated successfully",
        });
        this.resetForm();
        this.hideProductForm();
        this.loadProducts();
      },
      (error) => {
        console.error("Error updating product:", error);
        this.showError("Failed to update product");
      }
    );
  },

  getProductDataFromForm: function (form) {
    return {
      name: form.productName.value.trim(),
      category: form.category.value.trim(),
      price: parseFloat(form.price.value) || 0,
      description: form.description.value.trim(),
      discountPercentage: parseFloat(form.discountPercentage.value) || 0,
      stock_quantity: parseInt(form.stock.value) || 0,
      brand: form.brand.value.trim(),
      thumbnail: form.thumbnail.value.trim(),
      images: form.images.value
        ? form.images.value
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url)
        : [],
    };
  },

  resetForm: function () {
    const form = this.productForm.querySelector("form");
    form.reset();
    this.currentProductId = null;

    // Reset form title and submit button
    this.productForm.querySelector(".form-header h3").textContent =
      "Add New Product";
    form.querySelector('button[type="submit"]').textContent = "Add Product";

    // Reset validation states
    form.querySelectorAll("input, textarea").forEach((input) => {
      input.setAttribute("data-had-value", "false");
      input.classList.remove("error");
    });
  },

  showError: function (message) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    });
  },

  showProductForm: function (title) {
    this.productForm.style.display = "flex";
    this.productForm.querySelector(".form-header h3").textContent = title;

    // Delay the scroll slightly to ensure the form is visible first
    setTimeout(() => {
      this.productForm.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Focus on the first input field
      const firstInput = this.productForm.querySelector(
        'input:not([type="hidden"])'
      );
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  },

  hideProductForm: function () {
    this.productForm.style.display = "none";
  },

  escapeHtml: function (unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },
};

export default ProductManager;
