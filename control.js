/***********************************************************
  Variables & Initialization
************************************************************/
let doorState = localStorage.getItem("doorState") || "closed"; 
let doorOpenTimer;
let doorWarnTimer;

// 🔄 If app loads and we're stuck in "opening" or "closing" state, auto-reset to "closed"
if (doorState === "opening" || doorState === "closing") {
  setTimeout(() => {
    if (doorState === "opening" || doorState === "closing") {
      doorState = "closed";
      localStorage.setItem("doorState", doorState);
      updateDoorUI();
      logActivity("UI auto-reset to closed (fetch likely blocked)");
    }
  }, 5000); // after 5 seconds, force it to reset
}

// Update battery from localStorage
let batteryLevel = localStorage.getItem("batteryLevel") 
  ? parseInt(localStorage.getItem("batteryLevel")) 
  : 100;
document.querySelectorAll("#batteryStatus").forEach(el => el.innerText = `${batteryLevel}%`);

// On load, set UI
updateDoorUI();

/***********************************************************
  Navigation Buttons
************************************************************/
document.getElementById("homeBtn").addEventListener("click", () => {
  // Already on home
});
document.getElementById("logsBtn").addEventListener("click", () => {
  window.location.href = "logs.html";
});
document.getElementById("logoutBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

/***********************************************************
  Door Interactions
************************************************************/
document.querySelector(".door-circle").addEventListener("click", () => {
  if (doorState === "closed") {
    openDoor();
  } else if (doorState === "open") {
    closeDoor(false);
  }
});

/***********************************************************
  Open Door (App-triggered + ESP32 fetch)
************************************************************/
function openDoor() {
  if (doorState === "open" || doorState === "opening") return;

  doorState = "opening";
  localStorage.setItem("doorState", doorState);

  updateDoorUI();
  logActivity("Door started opening...");

  // 🛰️ Fetch to ESP32
  fetch("http://172.20.10.13/open")  // Change this IP to match your ESP32
    .then(res => res.text())
    .then(msg => console.log("ESP32:", msg))
    .catch(err => console.warn("ESP32 /open error:", err));

  // After 2 seconds, door becomes fully open
  setTimeout(() => {
    doorState = "open";
    localStorage.setItem("doorState", doorState);
    updateDoorUI();
    logActivity("Door opened manually");

    // Start 10s reminder log
    doorWarnTimer = setInterval(() => {
      if (doorState === "open") {
        logActivity("Reminder: Door is still open");
      }
    }, 10000);

    // Auto-close after 30s
    doorOpenTimer = setTimeout(() => {
      if (doorState === "open") {
        closeDoor(true);
      }
    }, 30000);

  }, 2000);
}

/***********************************************************
  Close Door (App-triggered + ESP32 fetch)
************************************************************/
function closeDoor(isAuto) {
  if (doorState === "closed" || doorState === "closing") return;

  doorState = "closing";
  localStorage.setItem("doorState", doorState);

  updateDoorUI();
  logActivity(isAuto ? "Door started auto-closing..." : "Door started closing...");

  // 🛰️ Fetch to ESP32
  fetch("http://172.20.10.13/close")  // Change this IP to match your ESP32
    .then(res => res.text())
    .then(msg => console.log("ESP32:", msg))
    .catch(err => console.warn("ESP32 /close error:", err));

  clearInterval(doorWarnTimer);
  clearTimeout(doorOpenTimer);

  // After 2 seconds, door becomes fully closed
  setTimeout(() => {
    doorState = "closed";
    localStorage.setItem("doorState", doorState);
    updateDoorUI();
    logActivity(isAuto ? "Door closed automatically" : "Door closed manually");
  }, 2000);
}

/***********************************************************
  updateDoorUI() - Swirl + image + label
************************************************************/
function updateDoorUI() {
  const doorImage = document.getElementById("doorImage");
  const swirl = document.getElementById("swirlAnim");
  const statusLabel = document.getElementById("doorStatusLabel");

  if (doorState === "opening") {
    swirl.style.display = "block";
    doorImage.src = "doorClosed.png";
    statusLabel.innerText = "Opening now...";
  } else if (doorState === "closing") {
    swirl.style.display = "block";
    doorImage.src = "doorOpen.png";
    statusLabel.innerText = "Closing now...";
  } else if (doorState === "open") {
    swirl.style.display = "none";
    doorImage.src = "doorOpen.png";
    statusLabel.innerText = "Door is open";
  } else {
    swirl.style.display = "none";
    doorImage.src = "doorClosed.png";
    statusLabel.innerText = "Door is closed";
  }
}

/***********************************************************
  logActivity(action) - Save to localStorage logs array
************************************************************/
function logActivity(action) {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  const timestamp = new Date().toLocaleString();
  logs.push(`${timestamp}: ${action}`);
  localStorage.setItem("logs", JSON.stringify(logs));
}
