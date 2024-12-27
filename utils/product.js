export async function addToCart(product_data, user_id) {
    const response = await fetch(`http://localhost:3000/api/users/${user_id}/cart` , {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product_data),
    })

    const data = await response.json();
    return data;
}


export async function updateWishlist( product_data, user_id) {
    const response = await fetch(`http://localhost:3000/api/users/${user_id}/wishlist`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product_data),
    });

    const data = await response.json();
    return data;
}