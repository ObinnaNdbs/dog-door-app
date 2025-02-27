let batteryLevel = localStorage.getItem("batteryLevel")
  ? parseInt(localStorage.getItem("batteryLevel"))
  : 100;
const logList = document.getElementById("logList");
let logs = JSON.parse(localStorage.getItem("logs")) || [];
let doorStatus = localStorage.getItem("doorStatus") || "Closed";
let doorOpenTimer;
let autoCloseTimer;
const logsPerPage = 20; // Logs per page
let currentPage = 1; // Default page

// Immediately update battery and door status display on page load
document.querySelectorAll("#batteryStatus").forEach(el => el.innerText = `${batteryLevel}%`);
updateDoorIndicator();
initDoorNotification(); // Start notification and auto-lock logic if door is open
displayLogs(); // Display logs for the current page

// Back to Control Page
document.getElementById("back").addEventListener("click", () => {
  window.location.href = "control.html";
});

// Update Door Indicator
function updateDoorIndicator() {
  const doorIndicator = document.getElementById("doorIndicator");
  doorIndicator.innerText = doorStatus === "Open" ? "🔴" : "🟢";
}

// Battery Simulation
setInterval(() => {
  if (batteryLevel === 0) {
    batteryLevel = 100; // Restart from 100% when it hits 0%
  } else {
    batteryLevel = Math.max(0, batteryLevel - 1); // Decrease battery
  }
  document.querySelectorAll("#batteryStatus").forEach(el => el.innerText = `${batteryLevel}%`);
  localStorage.setItem("batteryLevel", batteryLevel); // Save to localStorage
}, 10000);

// Notification and Auto-Close Logic
function initDoorNotification() {
  if (doorStatus === "Open") {
    startOpenDoorNotification();
    startAutoCloseTimer();
  }
}

function startOpenDoorNotification() {
  doorOpenTimer = setTimeout(function notifyOpenDoor() {
    if (doorStatus === "Open") {
      showNotification("The door has been open for too long!");
      doorOpenTimer = setTimeout(notifyOpenDoor, 15000); // Repeat every 15 seconds
    }
  }, 15000);
}

function startAutoCloseTimer() {
  autoCloseTimer = setTimeout(() => {
    if (doorStatus === "Open") {
      doorStatus = "Closed";
      localStorage.setItem("doorStatus", doorStatus);
      updateDoorIndicator();
      showNotification("Door automatically closed");
    }
  }, 60000); // Auto-close after 1 minute
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.color = "red";
  notification.style.marginTop = "10px";
  notification.style.textAlign = "center";
  document.getElementById("app").appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Display Logs
function displayLogs() {
  logList.innerHTML = ""; // Clear current logs
  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = Math.min(startIndex + logsPerPage, logs.length);

  // Display logs from newest to oldest
  for (let i = startIndex; i < endIndex; i++) {
    const li = document.createElement("li");
    li.textContent = logs[logs.length - 1 - i]; // Reverse order
    logList.appendChild(li);
  }

  // Update pagination controls
  updatePagination();
}

// Pagination Controls
function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = ""; // Clear existing controls
  const totalPages = Math.ceil(logs.length / logsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = i === currentPage ? "active" : "";
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayLogs();
    });
    pagination.appendChild(pageButton);
  }
}
