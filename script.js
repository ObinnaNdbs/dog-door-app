const authorizedRFIDs = ["12345", "67890"];
let batteryLevel = localStorage.getItem("batteryLevel")
  ? parseInt(localStorage.getItem("batteryLevel"))
  : 100;

// Immediately update battery display on page load
document.querySelectorAll("#batteryStatus").forEach((el) => el.innerText = `${batteryLevel}%`);

// Battery drain every 3 seconds
setInterval(() => {
  if (batteryLevel > 0) {
    batteryLevel--;
    if (batteryLevel === 20) {
      alert("Battery at 20% — please charge soon!");
    } else if (batteryLevel === 10) {
      alert("Battery at 10% — critical level!");
    }
  } else {
    batteryLevel = 100;
    alert("Battery recharged to 100%!");
  }
  document.querySelectorAll("#batteryStatus").forEach((el) => el.innerText = `${batteryLevel}%`);
  localStorage.setItem("batteryLevel", batteryLevel);
}, 3000);

// RFID Login
document.getElementById("check").addEventListener("click", () => {
  const rfid = document.getElementById("rfid").value.trim();
  if (authorizedRFIDs.includes(rfid)) {
    localStorage.setItem("doorStatus", "Closed");
    window.location.replace("control.html");
  } else {
    alert("Unauthorized RFID Tag!");
  }
});
