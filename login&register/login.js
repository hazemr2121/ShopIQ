// const form = document.getElementById("loginForm");
// const emailInput = document.getElementById("email");
// const passwordInput = document.getElementById("password");

// form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const email = emailInput.value.trim();
//     const password = passwordInput.value.trim();

//     // Basic client-side validation
//     if (!emailRegex.test(email) || !passwordRegex.test(password)) {
//       alert("Please ensure your inputs are correct.");
//       return;
//     }

//     // Send the data to the server to check credentials
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         // Handle success (redirect to dashboard, etc.)
//         window.location.href = "/dashboard";
//       } else {
//         // Handle error (display message)
//         if (data.error === "Email not found") {
//           emailMassage.textContent = "Email not found.";
//         } else if (data.error === "Incorrect password") {
//           passwordMassage.textContent = "Incorrect password. Please try again.";
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   });
