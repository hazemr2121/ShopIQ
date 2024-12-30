const BASE_URL = "http://localhost:3000/api/users";

export async function getAllUsers() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching users:", error);
    throw error;
  }
}

//================ Get User by ID =====================================
export async function getUserById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Fetch by ID failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch by ID error:", error);
    throw error;
  }
}

//================ Add User ===========================================
// export async function addUser(user) {
//   try {
//     const response = await fetch(BASE_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify(user),
//     });

//     if (!response.ok) {
//       throw new Error(
//         `message: ${response.statusText}, status: ${response.status}`
//       );
//     }

//     const data = await response.json();
//     return data; // Return the response data
//   } catch (error) {
//     console.log("Error in addUser:", error);
//     throw error;
//   }
// }

export async function addUser(user) {
  try {
    // Log the exact request being made
    console.log("Making POST request to:", BASE_URL);
    console.log("Request payload:", {
      ...user,
      password: "***hidden***", // Hide password in logs
    });

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(user),
    });

    // Get response body regardless of status
    const responseText = await response.text();

    // Try to parse as JSON if possible
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );
    console.log("Response data:", responseData);

    if (!response.ok) {
      throw new Error(
        JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        })
      );
    }

    return responseData;
  } catch (error) {
    console.error("Detailed error in addUser:", error);
    throw error;
  }
}
//================ Delete User ========================================
export async function deleteUser(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      if (response.status === 405) {
        throw new Error(
          "DELETE method not allowed. Check API endpoint configuration."
        );
      }
      throw new Error(`Delete failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
}

//================ Update User ========================================
export async function updateUser(id, updatedData) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify(updatedData),
    });

    // console.log(body);

    if (!response.ok) {
      throw new Error(`Update failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    console.log(email);
    const response = await fetch(
      `http://localhost:3000/api/userByEmail/${email}`
    );

    if (!response.ok) {
      throw new Error(`Fetching failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetching error:", error);
    throw error;
  }
}
