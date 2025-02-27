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

// **🔹 LOGIN FUNCTION (SPA MODE)**
document.getElementById("loginButton").addEventListener("click", () => {
  const rfid = document.getElementById("rfidInput").value;
  if (authorizedRFIDs.includes(rfid)) {
    localStorage.setItem("doorStatus", "Closed"); // Set default door status
    document.getElementById("loginPage").style.display = "none";  // Hide login
    document.getElementById("controlPage").style.display = "block";  // Show control panel
  } else {
    showAlert("Unauthorized RFID Tag!");
  }
});

// **🔹 DOOR CONTROLS**
document.getElementById("openButton").addEventListener("click", () => {
  doorStatus = "Open";
  localStorage.setItem("doorStatus", doorStatus);
  updateDoorIndicator();
  showNotification("Door Opened");
  startOpenDoorNotification();
  startAutoCloseTimer();
});

document.getElementById("closeButton").addEventListener("click", () => {
  doorStatus = "Closed";
  localStorage.setItem("doorStatus", doorStatus);
  updateDoorIndicator();
  clearTimeout(doorOpenTimer);
  clearTimeout(autoCloseTimer);
  showNotification("Door Closed");
});

document.getElementById("logoutButton").addEventListener("click", () => {
  document.getElementById("loginPage").style.display = "block"; // Show login page
  document.getElementById("controlPage").style.display = "none"; // Hide control panel
});

// **🔹 ALERT FUNCTION**
function showAlert(message) {
  const alertDiv = document.createElement("div");
  alertDiv.textContent = message;
  alertDiv.style.color = "red";
  alertDiv.style.marginTop = "10px";
  document.getElementById("loginPage").appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000); // Remove alert after 3 seconds
}

// **🔹 UPDATE DOOR STATUS INDICATOR**
function updateDoorIndicator() {
  const doorIndicator = document.getElementById("doorStatus");
  doorIndicator.innerText = doorStatus;
}

// **🔹 BATTERY SIMULATION (Every 10s)**
setInterval(() => {
  if (batteryLevel === 0) {
    batteryLevel = 100; // Restart battery
  } else {
    batteryLevel = Math.max(0, batteryLevel - 1); // Reduce battery
  }
  document.querySelectorAll("#batteryStatus").forEach(el => el.innerText = `${batteryLevel}%`);
  localStorage.setItem("batteryLevel", batteryLevel);
}, 10000);

// **🔹 AUTO-CLOSE & NOTIFICATIONS**
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
  }, 60000); // Auto-close after 1 min
}

// **🔹 SHOW NOTIFICATIONS**
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.color = "red";
  notification.style.marginTop = "10px";
  notification.style.textAlign = "center";
  document.getElementById("controlPage").appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
