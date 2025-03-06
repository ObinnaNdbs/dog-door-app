let batteryLvl3 = localStorage.getItem("batteryLevel") || 100;
document.querySelectorAll("#batteryStatus").forEach(el => el.innerText = `${batteryLvl3}%`);

// Load logs
const logList = document.getElementById("logList");
let logs = JSON.parse(localStorage.getItem("logs")) || [];
showLogs();

// NAV Buttons
document.getElementById("homeBtn").addEventListener("click", () => {
  window.location.href = "control.html";
});
document.getElementById("logsBtn").addEventListener("click", () => {
  // Already on logs
});
document.getElementById("logoutBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

function showLogs() {
  logList.innerHTML = "";
  // Newest at top
  for (let i = logs.length - 1; i >= 0; i--) {
    const li = document.createElement("li");
    li.textContent = logs[i];
    logList.appendChild(li);
  }
}
