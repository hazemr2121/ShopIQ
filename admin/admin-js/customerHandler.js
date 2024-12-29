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

// Event Listeners
cancelBtn.addEventListener("click", () => {
  closeModal();
});

addBtn.addEventListener("click", () => {
  openModal();
});
searchIcon.addEventListener("click", handleSearchEmail);

async function handleSearchEmail() {
  const searchEmail = searchEmailInput.value.trim();
  console.log(searchEmail);
  try {
    const user = await getUserByEmail(searchEmail);
    console.log("user found :", user);

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
  } catch (error) {
    console.log("Error getting user:", error);
  }
}

function displayUsers() {
  getAllUsers()
    .then((data) => {
      if (data) {
        // Clear existing table body
        tableBody.innerHTML = "";

        // Populate table with user data
        data.forEach((user) => {
          const row = document.createElement("tr");
          const createdAt = new Date(user.createdAt).toLocaleDateString();

          // Store the complete _id as a data attribute
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

        // Setup handlers for the new rows
        handleDelete();
        handleUpdate();
      } else {
        console.log("No users found.");
      }
    })
    .catch((error) => {
      console.log("Error fetching users:", error);
    });
}

// Initial display
displayUsers();

// function addNewUser() {
//   const form = document.querySelector(".add-customer-form");

//   form.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const username = form.querySelector("input[name='username']").value;
//     const email = form.querySelector("input[name='email']").value;
//     const password = form.querySelector("input[name='password']").value;
//     const confirmPassword = form.querySelector(
//       "input[name='confirm-password']"
//     ).value;
//     const phone = form.querySelector("input[name='phone']").value;
//     const role = form.querySelector("select[name='role']").value;

//     // Basic validation
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     const newUser = {
//       username: username,
//       email: email,
//       password: password,
//       phone: phone,
//       role: role,
//     };

//     console.log(newUser);

//     try {
//       console.log("Sending user data:", newUser);

//       const response = await addUser(newUser);
//       console.log("User added:", response);
//       closeModal();
//       displayUsers();
//     } catch (error) {
//       console.log("Error adding user:", error);
//     }
//   });
// }
function addNewUser() {
  const form = document.querySelector(".add-customer-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = form.querySelector("input[name='username']").value.trim();
    const email = form.querySelector("input[name='email']").value.trim();
    const password = form.querySelector("input[name='password']").value;
    const confirmPassword = form.querySelector(
      "input[name='confirm-password']"
    ).value;
    const phone = form.querySelector("input[name='phone']").value.trim();
    const address = form.querySelector("input[name='address']").value.trim();
    const role = form.querySelector("select[name='role']").value;

    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Create user object
    const newUser = {
      username: username,
      email: email,
      password: password,
      address: address,
      phone: phone,
      role: role,
    };

    // Debug log to see exact data being sent
    console.log("Attempting to send user data:", {
      ...newUser,
      password: "***hidden***", // Hide password in logs for security
    });

    try {
      // Add loading state
      const saveButton = form.querySelector(".btn-save");
      saveButton.textContent = "Saving...";
      saveButton.disabled = true;

      const response = await addUser(newUser);
      console.log("Server response:", response);

      closeModal();
      displayUsers();
    } catch (error) {
      console.error("Full error details:", error);

      if (error.response) {
        alert(
          `Failed to add user: ${error.response.data?.message || error.message}`
        );
      } else {
        alert("Failed to add user. Please check the console for details.");
      }
    } finally {
      // Reset button state
      const saveButton = form.querySelector(".btn-save");
      saveButton.textContent = "Save Customer";
      saveButton.disabled = false;
    }
  });
}

addNewUser();

function handleDelete() {
  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const userId = e.target.getAttribute("data-id");

      // Confirm before deleting
      const confirmDelete = confirm(
        "Are you sure you want to delete this user?"
      );
      if (!confirmDelete) return;

      try {
        // Send the MongoDB _id string directly
        const response = await deleteUser(userId); // MongoDB _id is already a string
        console.log("User deleted:", response);
        displayUsers();
      } catch (error) {
        if (error.message.includes("ObjectId")) {
          console.error("Invalid MongoDB ObjectId format:", error);
        } else {
          console.error("Error deleting user:", error);
        }
        alert("Failed to delete user. Please try again.");
      }
    });
  });
}

function handleUpdate() {
  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const userId = e.target.getAttribute("data-id");

      console.log(userId);

      try {
        // Send the MongoDB _id string directly
        const user = await getUserById(userId); // MongoDB _id is already a string

        console.log(user);
        if (!user) {
          throw new Error("User not found");
        }
        openEditModal(user);
      } catch (error) {
        if (error.message.includes("ObjectId")) {
          console.error("Invalid MongoDB ObjectId format:", error);
        } else {
          console.error("Error fetching user:", error);
        }
        alert("Failed to load user data. Please try again.");
      }
    });
  });
}

function openEditModal(user) {
  const modal = document.getElementById("customerModal");
  const form = document.querySelector(".add-customer-form");

  modal.style.display = "block";
  // openModal();

  // Store the MongoDB _id in a data attribute on the form
  form.setAttribute("data-user-id", user._id);

  // Update modal title
  modal.querySelector(".modal-header h3").textContent = "Edit Customer";

  // Update form fields
  form.querySelector("input[name='username']").value = user.username;
  form.querySelector("input[name='email']").value = user.email;
  form.querySelector("input[name='phone']").value = user.phone || "";
  form.querySelector("input[name='address']").value = user.address || "";
  form.querySelector("select[name='role']").value = user.role;

  // Get password field containers
  const passwordGroup = form.querySelector(
    "input[name='password']"
  ).parentElement;
  const confirmPasswordGroup = form.querySelector(
    "input[name='confirm-password']"
  ).parentElement;

  // Remove required attribute and hide the fields
  const passwordInput = form.querySelector("input[name='password']");
  const confirmPasswordInput = form.querySelector(
    "input[name='confirm-password']"
  );

  passwordInput.removeAttribute("required");
  confirmPasswordInput.removeAttribute("required");

  // Hide the entire form groups
  passwordGroup.style.display = "none";
  confirmPasswordGroup.style.display = "none";

  form.onsubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      username: form.querySelector("input[name='username']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      address: form.querySelector("input[name='address']").value,
      role: form.querySelector("select[name='role']").value,
    };

    try {
      const userId = form.getAttribute("data-user-id");
      if (!userId) {
        throw new Error("User ID is missing");
      }

      const response = await updateUser(userId, updatedUser);
      console.log("User updated:", response);
      closeModal();
      displayUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };
}

function openModal() {
  const modal = document.getElementById("customerModal");
  const form = document.querySelector(".add-customer-form");
  const modalTitle = modal.querySelector(".modal-header h3");

  modalTitle.textContent = "Add New Customer";
  form.reset();

  form.removeAttribute("data-user-id");

  const passwordGroup = form.querySelector(
    "input[name='password']"
  ).parentElement;
  const confirmPasswordGroup = form.querySelector(
    "input[name='confirm-password']"
  ).parentElement;
  const passwordInput = form.querySelector("input[name='password']");
  const confirmPasswordInput = form.querySelector(
    "input[name='confirm-password']"
  );

  passwordGroup.style.display = "block";
  confirmPasswordGroup.style.display = "block";
  passwordInput.setAttribute("required", "");
  confirmPasswordInput.setAttribute("required", "");

  form.onsubmit = (e) => {
    e.preventDefault();
    addNewUser(e);
  };

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("customerModal");
  const form = document.querySelector(".add-customer-form");

  // Reset form and clear stored ID
  form.reset();
  form.removeAttribute("data-user-id");

  // Restore password fields to their original state
  const passwordGroup = form.querySelector(
    "input[name='password']"
  ).parentElement;
  const confirmPasswordGroup = form.querySelector(
    "input[name='confirm-password']"
  ).parentElement;
  const passwordInput = form.querySelector("input[name='password']");
  const confirmPasswordInput = form.querySelector(
    "input[name='confirm-password']"
  );

  // Show fields and restore required attribute
  passwordGroup.style.display = "block";
  confirmPasswordGroup.style.display = "block";
  passwordInput.setAttribute("required", "");
  confirmPasswordInput.setAttribute("required", "");

  modal.style.display = "none";
}
