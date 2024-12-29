const changeAccount = document.querySelector(".account");
if (localStorage.getItem("userName")) {
  changeAccount.innerHTML = `
    <a href="../profile/profile.html" class="icon-link">
      <i class="fa fa-user"></i>
      <span>${localStorage.getItem("userName")}</span>
    </a>
  `;
}

const signOut = document.getElementById("signout-btn");

signOut.addEventListener("click", () => {
  localStorage.clear();
  location.href = "/ui/temp.html";
});

const infoSection = document.getElementById("info-section");
function getInfoSection() {
  // i want to add edit password
  infoSection.innerHTML = `
  <form >
    <div class="flex-between">
      <p><strong>Name:</strong></p>
      <input
        type="text"
        id="user-name"
        placeholder="Enter your name"
        value="${localStorage.getItem("userName")}"
      />
    </div>

    <div class="flex-between">
      <p><strong>E-mail:</strong></p>
      <input
        type="text"
        value="${localStorage.getItem("email")}"
        disabled
      />
    </div>

    <div class="flex-between">
      <p><strong>Address:</strong></p>
      <input
        type="text"
        id="user-adress"
        placeholder="Enter your address"
        value="${
          localStorage.getItem("address") ? localStorage.getItem("address") : ""
        }"
      />
    </div>
    <div class="flex-between">
      <p><strong>Phone:</strong></p>
      <input
        type="tel"
        id="user-phone"
        placeholder="Enter your phone number"
        value="${
          localStorage.getItem("phone") ? localStorage.getItem("phone") : ""
        }"
      />
    </div>


    <div class="flex-end">
      <button class="reset-btn" type="reset">Reset</button>
      <button class="update-info" type="submit">Update</button>
    </div>
    </form>
  `;
}

function updateInfoSection() {
  const updateInfo = document.querySelector(".update-info");
  updateInfo.addEventListener("click", (event) => {
    event.preventDefault();
    const userName = document.getElementById("user-name").value;
    const userAddress = document.getElementById("user-adress").value;
    const regExpPhone = /^[0-9]+$/;
    const userPhone = document.getElementById("user-phone").value;
    if (userName) {
      localStorage.setItem("userName", userName);
    }
    localStorage.setItem("address", userAddress);
    if (regExpPhone.test(userPhone) || userPhone == "") {
      localStorage.setItem("phone", userPhone);
    }

    fetch(`http://localhost:3000/api/users/${localStorage.getItem("userId")}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        email: localStorage.getItem("email"),
        address: userAddress,
        phone: userPhone,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("userId", data._id);
        localStorage.setItem("userName", data.username);
        localStorage.setItem("address", data.address);
        localStorage.setItem("phone", data.phone);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    getInfoSection();
    updateInfoSection();
  });
}
getInfoSection();
updateInfoSection();
