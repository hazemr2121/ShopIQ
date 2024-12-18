import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

async function fetchAndInsertProducts(
  name,
  category,
  price,
  description,
  discountPercentage,
  rating,
  stock_quantity,
  brand,
  thumbnail,
  reviews,
  image
) {
  try {
    // Fetch data from the API
    const response = await fetch("https://dummyjson.com/products?limit=150");
    const { products } = await response.json();

    //     // Map the products to the desired structure
    const processedData = products.map((product) => ({
      //       id: product.id,
      name: product.title,
      category: product.category,
      price: product.price,
      description: product.description,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock_quantity: product.stock,
      brand: product.brand,
      thumbnail: product.thumbnail,
      reviews: product.reviews, // Placeholder review comment
      image: product.images, // Use the first image or fallback to thumbnail
    }));
    function writeProductData(processedData) {
      const db = getDatabase(); // Initialize Realtime Database

      processedData.forEach((product, index) => {
        const productRef = ref(db, "products/" + index); // Create a reference for each product

        set(productRef, {
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock_quantity: product.stock_quantity,
          brand: product.brand || "Unknown", // Default to "Unknown" if missing
          thumbnail: product.thumbnail,
          reviews: product.reviews || "No reviews yet", // Default to placeholder if missing
          image: product.image || product.thumbnail, // Fallback to thumbnail if images missing
        })
          .then(() => {
            console.log(`Product ${index} added successfully!`);
          })
          .catch((error) => {
            console.error(`Error adding product ${index}:`, error);
          });
      });
    }
    writeProductData(processedData);

    //     // Insert the processed data into the database
    //supabase insertion
    // const { data, error } = await app.from("Products").insert(processedData);

    //     // Log the result
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  } catch (err) {
    console.error("Error fetching or inserting data:", err);
  }
}
fetchAndInsertProducts();

// firebase init

const firebaseConfig = {
  databaseURL:
    "https://store-ec3ce-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
console.log(app);
