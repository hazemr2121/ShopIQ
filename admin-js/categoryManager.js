import Database from "./database.js";

const CategoryManager = {
  categoryList: document.getElementById("category-list"),
  categoryForm: document.getElementById("categoryForm"),
  currentCategoryId: null,
  categoryProductCounts: {},

  init: function () {
    this.categoryForm.style.display = "none";

    const addCategoryBtn = document.querySelector("#addCategoryBtn");
    if (addCategoryBtn) {
      addCategoryBtn.addEventListener("click", () => {
        this.showCategoryForm("Add New Category");
      });
    }

    this.attachEventListeners();
    this.loadCategories();
    this.setupFormValidation();

    document
      .querySelector('[data-page="categories"]')
      .addEventListener("click", () => {
        this.loadCategories();
      });
  },

  setupFormValidation: function () {
    const form = this.categoryForm.querySelector("form");

    form.querySelectorAll("input, textarea").forEach((input) => {
      input.removeAttribute("required");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.validateForm(form)) {
        if (this.currentCategoryId) {
          this.handleCategoryUpdate(event);
        } else {
          this.handleCategorySubmit(event);
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        this.categoryForm.style.display === "flex"
      ) {
        this.hideCategoryForm();
        this.resetForm();
      }
    });
  },

  validateForm: function (form) {
    const validationRules = [
      {
        name: "categoryName",
        label: "Category Name",
        minLength: 3,
        maxLength: 50,
        required: true,
        format: /^[a-zA-Z0-9-]+$/, // Only allow letters, numbers, and hyphens
      },
      {
        name: "description",
        label: "Description",
        minLength: 10,
        maxLength: 200,
      },
    ];

    let isValid = true;
    let errors = [];

    validationRules.forEach((field) => {
      const input = form[field.name];
      const value = input.value.trim();

      input.classList.remove("error");

      if (field.required && !value) {
        errors.push(`${field.label} is required`);
        isValid = false;
        input.classList.add("error");
        return;
      }

      if (!value && !field.required) return;

      if (field.minLength && value.length < field.minLength) {
        errors.push(
          `${field.label} must be at least ${field.minLength} characters long`
        );
        isValid = false;
        input.classList.add("error");
      }

      if (field.maxLength && value.length > field.maxLength) {
        errors.push(
          `${field.label} must be less than ${field.maxLength} characters long`
        );
        isValid = false;
        input.classList.add("error");
      }

      if (field.format && !field.format.test(value)) {
        errors.push(
          `${field.label} can only contain letters, numbers, and hyphens`
        );
        isValid = false;
        input.classList.add("error");
      }
    });

    if (!isValid) {
      this.showError(errors.join("\n"));
    }

    return isValid;
  },

  attachEventListeners: function () {
    this.categoryList.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-delete")) {
        this.handleDelete(event);
      } else if (event.target.classList.contains("btn-edit")) {
        this.handleEdit(event);
      }
    });

    this.categoryForm
      .querySelector(".close-btn")
      .addEventListener("click", () => {
        this.hideCategoryForm();
        this.resetForm();
      });

    this.categoryForm
      .querySelector('button[type="button"]')
      .addEventListener("click", () => {
        this.hideCategoryForm();
        this.resetForm();
      });
  },

  loadCategories: function () {
    this.categoryList.innerHTML =
      '<tr><td colspan="4" class="text-center">Loading categories...</td></tr>';

    // First, fetch the product counts for each category
    Database.fetchCategoryProductCounts(
      (productCounts) => {
        this.categoryProductCounts = productCounts;
        // Then fetch the categories
        Database.fetchCategories(
          (categories) => {
            this.displayCategories(categories);
          },
          (error) => {
            console.error("Error loading categories:", error);
            this.categoryList.innerHTML =
              '<tr><td colspan="4" class="text-center text-error">Error loading categories</td></tr>';
            this.showError("Failed to load categories. Please try again.");
          }
        );
      },
      (error) => {
        console.error("Error loading product counts:", error);
        this.showError("Failed to load product counts");
      }
    );
  },

  displayCategories: function (categories) {
    this.categoryList.innerHTML = "";

    if (!categories || Object.keys(categories).length === 0) {
      this.categoryList.innerHTML =
        '<tr><td colspan="4" class="text-center">No categories found</td></tr>';
      return;
    }

    Object.keys(categories).forEach((key) => {
      const category = categories[key];
      const productCount = this.categoryProductCounts[category.name] || 0;
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${this.escapeHtml(category.name)}</td>
                <td>${this.escapeHtml(category.description || "")}</td>
                <td>${productCount}</td>
                <td>
                    <button class="btn btn-edit" data-id="${key}">Edit</button>
                    <button class="btn btn-delete" data-id="${key}" ${
        productCount > 0 ? "disabled" : ""
      }>Delete</button>
                </td>
            `;

      this.categoryList.appendChild(row);
    });
  },

  handleDelete: function (event) {
    const categoryId = event.target.getAttribute("data-id");

    // Check if the button is disabled
    if (event.target.disabled) {
      this.showError(
        "Cannot delete category that has products. Please remove or reassign all products first."
      );
      return;
    }

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
        Database.deleteCategory(
          categoryId,
          () => {
            Swal.fire("Deleted!", "Category has been deleted.", "success");
            this.loadCategories();
          },
          (error) => {
            console.error("Error deleting category:", error);
            this.showError("Failed to delete category");
          }
        );
      }
    });
  },

  handleEdit: function (event) {
    const categoryId = event.target.getAttribute("data-id");

    Database.fetchCategories(
      (categories) => {
        const category = categories[categoryId];
        if (category) {
          this.fillFormWithCategory(category, categoryId);
          this.showCategoryForm("Edit Category");
        } else {
          this.showError("Category not found");
        }
      },
      (error) => {
        console.error("Error fetching category:", error);
        this.showError("Failed to fetch category details");
      }
    );
  },

  fillFormWithCategory: function (category, categoryId) {
    const form = this.categoryForm.querySelector("form");

    form.categoryName.value = category.name || "";
    form.description.value = category.description || "";

    form.categoryName.setAttribute(
      "data-had-value",
      category.name ? "true" : "false"
    );
    form.description.setAttribute(
      "data-had-value",
      category.description ? "true" : "false"
    );

    this.currentCategoryId = categoryId;

    this.categoryForm.querySelector(".form-header h3").textContent =
      "Edit Category";
    form.querySelector('button[type="submit"]').textContent = "Update Category";
  },

  handleCategorySubmit: function (event) {
    const form = event.target;
    const categoryData = this.getCategoryDataFromForm(form);

    Database.addCategory(
      categoryData,
      () => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Category added successfully",
        });
        this.resetForm();
        this.hideCategoryForm();
        this.loadCategories();
      },
      (error) => {
        console.error("Error adding category:", error);
        this.showError("Failed to add category");
      }
    );
  },

  handleCategoryUpdate: function (event) {
    const form = event.target;
    const categoryData = this.getCategoryDataFromForm(form);

    Database.updateCategory(
      this.currentCategoryId,
      categoryData,
      () => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Category updated successfully",
        });
        this.resetForm();
        this.hideCategoryForm();
        this.loadCategories();
      },
      (error) => {
        console.error("Error updating category:", error);
        this.showError("Failed to update category");
      }
    );
  },

  getCategoryDataFromForm: function (form) {
    return {
      name: form.categoryName.value.trim().toLowerCase(),
      description: form.description.value.trim(),
    };
  },

  resetForm: function () {
    const form = this.categoryForm.querySelector("form");
    form.reset();
    this.currentCategoryId = null;

    this.categoryForm.querySelector(".form-header h3").textContent =
      "Add New Category";
    form.querySelector('button[type="submit"]').textContent = "Add Category";

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

  showCategoryForm: function (title) {
    this.categoryForm.style.display = "flex";
    this.categoryForm.querySelector(".form-header h3").textContent = title;

    setTimeout(() => {
      this.categoryForm.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      const firstInput = this.categoryForm.querySelector(
        'input:not([type="hidden"])'
      );
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  },

  hideCategoryForm: function () {
    this.categoryForm.style.display = "none";
  },

  escapeHtml: function (unsafe) {
    return unsafe
      ? unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
      : "";
  },
};

export default CategoryManager;
