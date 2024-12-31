import {
  getAllUsers,
  addUser,
  deleteUser,
  getUserById,
  updateUser,
  getUserByEmail,
} from "./customerManager.js";

const tableBody = document.querySelector(".table--body");
const saveBtn = document.querySelector(".btn-save");
const cancelBtn = document.querySelector(".btn-cancel");
const addBtn = document.querySelector(".add-btn");
const searchEmailInput = document.getElementById("user--search");
const searchIcon = document.querySelector(".search-icon");

// Validation function
function validateUserData(userData, isNewUser = true) {
  const errors = [];

  
  if (!userData.username || userData.username.trim().length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  // Email validation (for new users)
  if (isNewUser) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      errors.push("Please enter a valid email address");
    }
  }

  
  if (userData.phone) {
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(userData.phone)) {
      errors.push("Please enter a valid phone number");
    }
  }

  // Role validation
  if (!userData.role || userData.role.trim() === "") {
    errors.push("Please select a role");
  }


  if (isNewUser) {
    if (!userData.password || userData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
  }

  return errors;
}

// Handle email search
async function handleSearchEmail() {
  const searchEmail = searchEmailInput.value.trim();
  if (!searchEmail) {
    Swal.fire({
      title: "Error!",
      text: "Please enter an email to search",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  try {
    const user = await getUserByEmail(searchEmail);
    tableBody.innerHTML = "";
    const createdAt = new Date(user.createdAt).toLocaleDateString();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.phone || "N/A"}</td>
      <td>${user.role}</td>
      <td>${createdAt}</td>
      <td class="action-buttons">
        <button class="edit" data-id="${user._id}">Edit</button>
        <button class="delete" data-id="${user._id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
    handleDelete();
    handleUpdate();
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "User not found",
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
  }
}

// Display all users
function displayUsers() {
  getAllUsers()
    .then((data) => {
      if (data) {
        tableBody.innerHTML = "";
        data.forEach((user) => {
          const row = document.createElement("tr");
          const createdAt = new Date(user.createdAt).toLocaleDateString();

          row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone || "N/A"}</td>
            <td>${user.role}</td>
            <td>${createdAt}</td>
            <td class="action-buttons">
              <button class="edit" data-id="${user._id}">Edit</button>
              <button class="delete" data-id="${user._id}">Delete</button>
            </td>
          `;

          tableBody.appendChild(row);
        });

        handleDelete();
        handleUpdate();
      } else {
        Swal.fire({
          title: "Info",
          text: "No users found",
          icon: "info",
          confirmButtonColor: "#3085d6",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: "Error!",
        text: "Error fetching users: " + error.message,
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    });
}

// Setup form handlers
function setupFormHandlers() {
  const form = document.querySelector(".add-customer-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isEdit = form.hasAttribute("data-user-id");
    const currentEmail = isEdit
      ? form
          .querySelector("input[name='email']")
          .getAttribute("data-original-email")
      : null;

    const formData = {
      username: form.querySelector("input[name='username']").value.trim(),
      phone: form.querySelector("input[name='phone']").value.trim(),
      address: form.querySelector("input[name='address']").value.trim(),
      role: form.querySelector("select[name='role']").value,
    };

   
    const newEmail = form.querySelector("input[name='email']").value.trim();
    if (!isEdit || (isEdit && newEmail !== currentEmail)) {
      formData.email = newEmail;
    }

    // Add password for new users
    if (!isEdit) {
      const password = form.querySelector("input[name='password']").value;
      const confirmPassword = form.querySelector(
        "input[name='confirm-password']"
      ).value;

      if (password !== confirmPassword) {
        Swal.fire({
          title: "Error!",
          text: "Passwords do not match!",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
        return;
      }
      formData.password = password;
    }

  
    const validationErrors = validateUserData(formData, !isEdit);
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
      const saveButton = form.querySelector(".btn-save");
      saveButton.textContent = "Saving...";
      saveButton.disabled = true;

      if (isEdit) {
        const userId = form.getAttribute("data-user-id");
        await updateUser(userId, formData);

        Swal.fire({
          title: "Success!",
          text: "Customer updated successfully",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } else {
        await addUser(formData);

        Swal.fire({
          title: "Success!",
          text: "Customer added successfully",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      }

      closeModal();
      displayUsers();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to save customer",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      const saveButton = form.querySelector(".btn-save");
      saveButton.textContent = "Save Customer";
      saveButton.disabled = false;
    }
  });
}

// Handle delete
function handleDelete() {
  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const userId = e.target.getAttribute("data-id");

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
          await deleteUser(userId);
          Swal.fire({
            title: "Deleted!",
            text: "Customer has been deleted.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          displayUsers();
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete customer: " + error.message,
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    });
  });
}

// Handle update
function handleUpdate() {
  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const userId = e.target.getAttribute("data-id");
      try {
        const user = await getUserById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        openEditModal(user);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to load customer data: " + error.message,
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    });
  });
}

// Modal functions
function openModal() {
  const modal = document.getElementById("customerModal");
  const form = document.querySelector(".add-customer-form");
  const modalTitle = modal.querySelector(".modal-header h3");

  modalTitle.textContent = "Add New Customer";
  form.reset();
  form.removeAttribute("data-user-id");

  const passwordFields = form
    .querySelectorAll("input[name='password'], input[name='confirm-password']")
    .forEach((field) => {
      field.parentElement.style.display = "block";
      field.setAttribute("required", "");
    });

  modal.style.display = "block";
}

function openEditModal(user) {
  const modal = document.getElementById("customerModal");
  const form = document.querySelector(".add-customer-form");

  modal.querySelector(".modal-header h3").textContent = "Edit Customer";

  form.setAttribute("data-user-id", user._id);
  form.querySelector("input[name='username']").value = user.username;

  const emailInput = form.querySelector("input[name='email']");
  emailInput.value = user.email;
  emailInput.setAttribute("data-original-email", user.email);

  form.querySelector("input[name='phone']").value = user.phone || "";
  form.querySelector("input[name='address']").value = user.address || "";
  form.querySelector("select[name='role']").value = user.role;

  const passwordFields = form
    .querySelectorAll("input[name='password'], input[name='confirm-password']")
    .forEach((field) => {
      field.parentElement.style.display = "none";
      field.removeAttribute("required");
    });

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("customerModal");
  const form = document.querySelector(".add-customer-form");

  form.reset();
  form.removeAttribute("data-user-id");

  const passwordFields = form
    .querySelectorAll("input[name='password'], input[name='confirm-password']")
    .forEach((field) => {
      field.parentElement.style.display = "block";
      field.setAttribute("required", "");
    });

  modal.style.display = "none";
}

// Event listeners
cancelBtn.addEventListener("click", () => {
  closeModal();
});

addBtn.addEventListener("click", () => {
  openModal();
});

searchIcon.addEventListener("click", handleSearchEmail);

// Initialize
displayUsers();
setupFormHandlers();
