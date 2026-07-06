const API = "https://nexora-dashboard-klgw.onrender.com/health";

async function loadDashboard() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    document.getElementById("servers").textContent = data.servers;
    document.getElementById("users").textContent = data.users;
    document.getElementById("ping").textContent = data.ping + " ms";
    document.getElementById("status").textContent = data.status;

  } catch (err) {
    console.error(err);

    document.getElementById("status").textContent = "Offline";
  }
}

loadDashboard();
setInterval(loadDashboard, 5000);
function updateUptime() {
  const start = Date.now();

  setInterval(() => {
    const sec = Math.floor((Date.now() - start) / 1000);

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    document.getElementById("uptime").textContent =
      `${h}h ${m}m ${s}s`;
  }, 1000);
}

updateUptime();