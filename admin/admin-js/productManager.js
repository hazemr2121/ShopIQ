//==================

let BASE_URL = "http://localhost:3000/api/products";

//========get all products============================
export async function getAllProducts(category = "") {
  try {
    const url = category
      ? `${BASE_URL}?category=${encodeURIComponent(category)}`
      : BASE_URL;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error fetching products:", error);
    throw error;
  }
}

export async function getProductById(id) {
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

//================add product =====================================

export async function addProduct(product) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(
        `message: ${response.statusText}, status: ${response.status}`
      );
    }

    const data = await response.json();
    return data; // Return the response data
  } catch (error) {
    console.log("Error in addProduct:", error);
    throw error;
  }
}

//================================delete product===========================
export async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {},
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
    console.error("Delete product error:", error);
    throw error;
  }
}

export async function updateProduct(id, updatedData) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",

      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`Update failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

export async function getAllCategories() {
  try {
    const response = await fetch(`http://localhost:3000/api/categories`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`No categories found  : ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ftching error:", error);
    throw error;
  }
}
