let orders = [];
let updatedOrders;
let currentOrderId = null;

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

async function fetchOrders() {
  try {
    const response = await fetch("http://localhost:3000/api/orders");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    orders = await response.json();

    updatedOrders = orders.map((order) => ({
      ...order,
      paymentMethod: ["cash", "stripe", "paypal"][
        Math.floor(Math.random() * 3)
      ],
    }));

    console.log(updatedOrders);

    renderOrders(updatedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    Swal.fire({
      icon: "error",
      title: "Failed to Load Orders",
      text: "There was a problem loading the orders. Please try again later.",
      confirmButtonColor: "#3085d6",
    });
    document.getElementById("orders-table-body").innerHTML =
      '<tr><td colspan="7">Error loading orders. Please try again later.</td></tr>';
  }
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    Swal.fire({
      title: "Updating Order Status...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await fetch(
      `http://localhost:3000/api/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await Swal.fire({
      icon: "success",
      title: "Order Updated",
      text: `Order status has been updated to ${newStatus}`,
      timer: 2000,
      showConfirmButton: false,
    });

    await fetchOrders();
    closeModal();
  } catch (error) {
    console.error("Error updating order status:", error);
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Failed to update order status. Please try again.",
      confirmButtonColor: "#3085d6",
    });
  }
}

async function confirmStatusUpdate(orderId, newStatus) {
  const capitalizedStatus =
    newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
  const result = await Swal.fire({
    icon: "warning",
    title: `${capitalizedStatus} Order?`,
    text: `Are you sure you want to ${newStatus} this order?`,
    showCancelButton: true,
    confirmButtonColor: newStatus === "accepted" ? "#28a745" : "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: capitalizedStatus,
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    await updateOrderStatus(orderId, newStatus);
  }
}

function filterOrders() {
  const statusFilter = document.getElementById("status-filter").value;
  const paymentFilter = document.getElementById("payment-filter").value;
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();

  let filteredOrders = updatedOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    const matchesPayment =
      paymentFilter === "all" ||
      order.paymentMethod.toLowerCase() === paymentFilter;
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm) ||
      order.user?.email?.toLowerCase().includes(searchTerm);

    return matchesStatus && matchesSearch && matchesPayment;
  });

  renderOrders(filteredOrders);
}

function renderOrders(filteredOrders = updatedOrders) {
  const tbody = document.getElementById("orders-table-body");
  tbody.innerHTML = "";

  filteredOrders.forEach((order) => {
    console.log(order);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>#${order._id}</td>
      <td>${order.user?.email ?? "example@gmail.com"}</td>
      <td>${order.products.length} items</td>
      <td>${formatCurrency(calculateTotal(order))}</td>
      <td>${order.paymentMethod || "N/A"}</td>
      <td><span class="status-badge status-${order.status.toLowerCase()}">${
      order.status
    }</span></td>
      <td class="action-buttons">
          <button class="btn btn-view"  style= "background-color:#6e49a2;
  color: white"
 onclick="viewOrderDetails('${order._id}')">View Details</button>
          ${
            order.status === "pending"
              ? `
              <button class="btn btn-accept" style="background-color: #50875d ;color: white" onclick="confirmStatusUpdate('${order._id}', 'accepted')">Accept</button>
              <button class="btn btn-reject"  style="background-color: #b15962; color: white" onclick="confirmStatusUpdate('${order._id}', 'rejected')">Reject</button>
          `
              : ""
          }
      </td>
    `;
    tbody.appendChild(row);
  });
}

function calculateTotal(order) {
  const subtotal = order.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return subtotal + (order.shippingPrice || 40);
}

function viewOrderDetails(orderId) {
  const order = updatedOrders.find((o) => o._id === orderId);
  if (!order) {
    Swal.fire({
      icon: "error",
      title: "Order Not Found",
      text: "The requested order could not be found.",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  const modal = document.getElementById("orderModal");
  const content = document.getElementById("orderDetailsContent");
  currentOrderId = orderId;

  const subtotal = order.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const user = order?.user || {};
  content.innerHTML = `
  <div class="order-details">
      <div class="detail-section">
          <h4>Customer Information</h4>
          <p>Email: ${user.email ?? "example@gmail.com"}</p>
          <p>Phone: ${user.phone ?? "01117194193"}</p>
          <p>Username: ${user.username ?? "username"}</p>
      </div>
      <div class="detail-section">
          <h4>Shipping Address</h4>
          <p>${user.address ?? "example address"}</p>
      </div>
  </div>
;

    <table class="items-table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${order.products
              .map(
                (item) => `
                <tr>
                    <td>${item.product.title}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.product.price)}</td>
                    <td>${formatCurrency(
                      item.product.price * item.quantity
                    )}</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">Subtotal</td>
                <td>${formatCurrency(subtotal)}</td>
            </tr>
            <tr>
                <td colspan="3">Shipping</td>
                <td>${formatCurrency(order?.shippingPrice || " 40")}</td>
            </tr>
            <tr>
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>${formatCurrency(
                  subtotal + (order?.shippingPrice || "40")
                )}</strong></td>
            </tr>
        </tfoot>
    </table>
  `;

  const acceptBtn = document.getElementById("acceptBtn");
  const rejectBtn = document.getElementById("rejectBtn");
  if (order.status === "pending") {
    acceptBtn.style.display = "block";
    rejectBtn.style.display = "block";
  } else {
    acceptBtn.style.display = "none";
    rejectBtn.style.display = "none";
  }
  acceptBtn.onclick = () => confirmStatusUpdate(order._id, "accepted");
  rejectBtn.onclick = () => confirmStatusUpdate(order._id, "rejected");

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("orderModal");
  modal.style.display = "none";
  currentOrderId = null;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchOrders();

  document
    .getElementById("status-filter")
    .addEventListener("change", filterOrders);
  document
    .getElementById("payment-filter")
    .addEventListener("change", filterOrders);
  document
    .getElementById("search-input")
    .addEventListener("input", filterOrders);

  window.onclick = function (event) {
    const modal = document.getElementById("orderModal");
    if (event.target === modal) {
      closeModal();
    }
  };
});
