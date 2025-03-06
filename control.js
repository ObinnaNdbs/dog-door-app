// Retrieve stored battery & door status
let doorStatus = localStorage.getItem("doorStatus") || "Closed";
let doorOpenTimer;
let doorWarnTimer;

// Update battery display from localStorage (script.js handles draining)
let batteryLevel2 = localStorage.getItem("batteryLevel") || 100;
document.querySelectorAll("#batteryStatus").forEach(el => el.innerText = `${batteryLevel2}%`);

// On page load, set initial door status UI
updateDoorUI();

// HOME button
document.getElementById("homeBtn").addEventListener("click", () => {
  // Already on home, so do nothing (but you could refresh)
});

// LOGS button
document.getElementById("logsBtn").addEventListener("click", () => {
  window.location.href = "logs.html";
});

// LOGOUT button
document.getElementById("logoutBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

// Door open function
function openDoor() {
  doorStatus = "Open";
  localStorage.setItem("doorStatus", doorStatus);
  updateDoorUI();
  logActivity("Door opened manually");

  // Start 10s warnings
  doorWarnTimer = setInterval(() => {
    if (doorStatus === "Open") {
      logActivity("Reminder: Door is still open");
    }
  }, 10000);

  // Auto-close after 30s
  doorOpenTimer = setTimeout(() => {
    if (doorStatus === "Open") {
      closeDoor(true);
    }
  }, 30000);
}

// Door close function
function closeDoor(isAuto = false) {
  doorStatus = "Closed";
  localStorage.setItem("doorStatus", doorStatus);
  updateDoorUI();
  logActivity(isAuto ? "Door closed automatically" : "Door closed manually");

  clearInterval(doorWarnTimer);
  clearTimeout(doorOpenTimer);
}

// Update UI based on doorStatus
function updateDoorUI() {
  const statusLabel = document.getElementById("doorStatusLabel");
  const doorLabel = document.getElementById("doorLabel");
  const swirlAnim = document.getElementById("swirlAnim");
  const doorIcon = document.getElementById("doorIcon");

  if (doorStatus === "Open") {
    statusLabel.innerText = "Opening now...";
    swirlAnim.style.display = "block"; // Show swirl
    doorIcon.style.filter = "hue-rotate(0deg)"; // If you want color changes
  } else {
    statusLabel.innerText = "Closing now...";
    swirlAnim.style.display = "block"; // Could also hide swirl if closed
    doorIcon.style.filter = "hue-rotate(120deg)"; // Slight color difference
  }
  doorLabel.innerText = "Garage Door Opener";
}

// Re-use from old code: logging
function logActivity(action) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const timestamp = new Date().toLocaleString();
  logs.push(`${timestamp}: ${action}`);
  localStorage.setItem("logs", JSON.stringify(logs));
}

// If you want open/close buttons on this page, add them:
document.addEventListener("click", (e) => {
  if (e.target.id === "doorCircle" || e.target.id === "doorIcon") {
    // Toggle door if you want a click on circle to open/close
    if (doorStatus === "Closed") {
      openDoor();
    } else {
      closeDoor(false);
    }
  }
});
