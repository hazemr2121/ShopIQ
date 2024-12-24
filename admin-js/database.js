import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

var firebaseConfig = {
  databaseURL:
    "https://store-ec3ce-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
var app = initializeApp(firebaseConfig);
var db = getDatabase(app);

var Database = {
  // Products Methods
  fetchProducts: function (successCallback, errorCallback) {
    var productsRef = ref(db, "products/");
    onValue(
      productsRef,
      function (snapshot) {
        if (snapshot.exists()) {
          var products = snapshot.val();
          successCallback(products);
        } else {
          successCallback({});
        }
      },
      function (error) {
        errorCallback(error);
      }
    );
  },

  deleteProduct: function (productID, successCallback, errorCallback) {
    var productRef = ref(db, "products/" + productID);
    remove(productRef).then(successCallback).catch(errorCallback);
  },

  addProduct: function (productData, successCallback, errorCallback) {
    var productsRef = ref(db, "products/");
    var newProductRef = push(productsRef);
    set(newProductRef, productData)
      .then(() => successCallback(newProductRef.key))
      .catch(errorCallback);
  },

  updateProduct: function (
    productId,
    productData,
    successCallback,
    errorCallback
  ) {
    var productRef = ref(db, "products/" + productId);
    update(productRef, productData).then(successCallback).catch(errorCallback);
  },

  // Categories Methods
  fetchCategories: function (successCallback, errorCallback) {
    var categoriesRef = ref(db, "categories/");

    onValue(
      categoriesRef,
      function (snapshot) {
        if (snapshot.exists()) {
          var categories = snapshot.val();
          console.log(categories);
          successCallback(categories);
        } else {
          successCallback({});
        }
      },
      function (error) {
        errorCallback(error);
      }
    );
  },

  deleteCategory: function (categoryID, successCallback, errorCallback) {
    var categoryRef = ref(db, "categories/" + categoryID);
    remove(categoryRef).then(successCallback).catch(errorCallback);
  },

  addCategory: function (categoryData, successCallback, errorCallback) {
    var categoriesRef = ref(db, "categories/");
    var newCategoryRef = push(categoriesRef);
    set(newCategoryRef, categoryData)
      .then(() => successCallback(newCategoryRef.key))
      .catch(errorCallback);
  },

  updateCategory: function (
    categoryId,
    categoryData,
    successCallback,
    errorCallback
  ) {
    const categoryRef = ref(db, `categories/${categoryId}`);

    // Check that categoryData is an object with valid values
    if (categoryData && typeof categoryData === "object") {
      // Update the category data in the database
      update(categoryRef, categoryData)
        .then(() => {
          // Call the success callback if update is successful
          successCallback();
        })
        .catch((error) => {
          // Call the error callback if there's an error
          errorCallback(error);
        });
    } else {
      // If category data is invalid, call the error callback with a specific error
      errorCallback(new Error("Invalid category data"));
    }
  },

  fetchCategoryProductCounts: function (successCallback, errorCallback) {
    var productsRef = ref(db, "products/");
    onValue(
      productsRef,
      function (snapshot) {
        if (snapshot.exists()) {
          const products = snapshot.val();
          const counts = {};

          Object.values(products).forEach((product) => {
            console.log(product);
            if (product.category) {
              counts[product.category] = (counts[product.category] || 0) + 1;
            }
          });
          console.log(counts);

          successCallback(counts);
          console.log(counts);
        } else {
          successCallback({});
        }
      },
      function (error) {
        errorCallback(error);
      }
    );
  },
};

export default Database;
