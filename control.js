let batteryLevel = localStorage.getItem("batteryLevel")
  ? parseInt(localStorage.getItem("batteryLevel"))
  : 100;
let doorStatus = localStorage.getItem("doorStatus") || "Closed";
let doorOpenTimer;
let autoCloseTimer;

// Immediately update battery and door status display on page load
document.querySelectorAll("#batteryStatus").forEach(el => el.innerText = `${batteryLevel}%`);
updateStatus();
updateDoorIndicator();
initDoorNotification(); // Initialize notification and auto-close logic

// Update Door Status
function updateStatus() {
  document.getElementById("doorStatus").innerText = `Door Status: ${doorStatus}`;
}

function updateDoorIndicator() {
  const doorIndicator = document.getElementById("doorIndicator");
  doorIndicator.innerText = doorStatus === "Open" ? "🔴" : "🟢";
}

// Open Door Button
document.getElementById("open").addEventListener("click", () => {
  doorStatus = "Open";
  localStorage.setItem("doorStatus", doorStatus);
  updateStatus();
  updateDoorIndicator();
  logActivity("Door opened");

  // Start notification and auto-close timers
  startOpenDoorNotification();
  startAutoCloseTimer();
});

// Close Door Button
document.getElementById("close").addEventListener("click", () => {
  doorStatus = "Closed";
  localStorage.setItem("doorStatus", doorStatus);
  updateStatus();
  updateDoorIndicator();
  logActivity("Door closed");

  // Clear timers
  clearTimeout(doorOpenTimer);
  clearTimeout(autoCloseTimer);
});

// Battery Simulation
setInterval(() => {
  batteryLevel = batteryLevel > 0 ? batteryLevel - 1 : 100; // Restart from 100% at 0
  document.querySelectorAll("#batteryStatus").forEach(el => el.innerText = `${batteryLevel}%`);
  localStorage.setItem("batteryLevel", batteryLevel);
}, 10000);

// Initialize Notification and Auto-Close Logic
function initDoorNotification() {
  if (doorStatus === "Open") {
    startOpenDoorNotification();
    startAutoCloseTimer();
  }
}

// Open Door Notification
function startOpenDoorNotification() {
  doorOpenTimer = setTimeout(function notifyOpenDoor() {
    if (doorStatus === "Open") {
      showNotification("The door has been open for too long!");
      doorOpenTimer = setTimeout(notifyOpenDoor, 15000); // Repeat every 15 seconds
    }
  }, 15000);
}

// Auto Close Timer
function startAutoCloseTimer() {
  autoCloseTimer = setTimeout(() => {
    if (doorStatus === "Open") {
      doorStatus = "Closed";
      localStorage.setItem("doorStatus", doorStatus);
      updateStatus();
      updateDoorIndicator();
      logActivity("Door automatically closed");
    }
  }, 60000);
}

// Show Notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.color = "red";
  notification.style.marginTop = "10px";
  notification.style.textAlign = "center";
  document.getElementById("app").appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Log Activity Function
function logActivity(action) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  logs.push(`${new Date().toLocaleString()}: ${action}`);
  localStorage.setItem("logs", JSON.stringify(logs));
}

// Logs Button
document.getElementById("logs").addEventListener("click", () => {
  console.log("Logs button clicked");
  window.location.href = "logs.html";
});

// Logout Button
document.getElementById("logout").addEventListener("click", () => {
  console.log("Logout button clicked");
  window.location.href = "index.html";
});
