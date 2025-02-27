const authorizedRFIDs = ["12345", "67890"];
let batteryLevel = localStorage.getItem("batteryLevel")
  ? parseInt(localStorage.getItem("batteryLevel"))
  : 100;
let doorStatus = localStorage.getItem("doorStatus") || "Closed";
let doorOpenTimer;
let autoCloseTimer;

// Immediately update battery and door status display on page load
document.querySelectorAll("#batteryStatus").forEach(el => el.innerText = `${batteryLevel}%`);
updateDoorIndicator();
initDoorNotification(); // Start notification and auto-lock logic if door is open

// Check RFID Button
document.getElementById("check").addEventListener("click", () => {
  const rfid = document.getElementById("rfid").value;
  if (authorizedRFIDs.includes(rfid)) {
    localStorage.setItem("doorStatus", "Closed"); // Set door status to Closed by default
    window.location.href = "control.html"; // Redirect to the control page
  } else {
    showAlert("Unauthorized RFID Tag!");
  }
});

// Show Alert Function
function showAlert(message) {
  const alertDiv = document.createElement("div");
  alertDiv.textContent = message;
  alertDiv.style.color = "red";
  alertDiv.style.marginTop = "10px";
  document.getElementById("app").appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000); // Remove alert after 3 seconds
}

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
