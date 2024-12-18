// !import DO NOT RUN THIS FILE
// async function fetchAndInsertProducts() {
//   try {
//     // Fetch data from the API
//     const response = await fetch("https://dummyjson.com/products?limit=150");
//     const { products } = await response.json();
//     console.log("Fetched products:", products);

//     //     // Map the products to the desired structure
//     const processedData = products.map((product) => ({
//       //       id: product.id,
//       name: product.title,
//       category: product.category,
//       price: product.price,
//       description: product.description,
//       discountPercentage: product.discountPercentage,
//       rating: product.rating,
//       stock_quantity: product.stock,
//       brand: product.brand,
//       thumbnail: product.thumbnail,
//       reviews: product.reviews[0].comment, // Placeholder review comment
//       image: product.images?.[0] || product.thumbnail, // Use the first image or fallback to thumbnail
//     }));

//     //     // Insert the processed data into the database
//     const { data, error } = await app.from("Products").insert(processedData);

//     //     // Log the result
//     if (error) {
//       console.error("Error inserting data:", error);
//     } else {
//       console.log("Data inserted successfully:", data);
//     }
//   } catch (err) {
//     console.error("Error fetching or inserting data:", err);
//   }
// }
// fetchAndInsertProducts();
