const API = "https://nexora-dashboard-klgw.onrender.com/health";

async function updateStatus() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    document.getElementById("servers").textContent = data.servers;
    document.getElementById("users").textContent = data.users;
    document.getElementById("ping").textContent = data.ping + "ms";
    document.getElementById("botstatus").textContent = data.status;

    const serverCount = document.getElementById("serverCount");
    if (serverCount) serverCount.textContent = data.servers;

    const memberCount = document.getElementById("memberCount");
    if (memberCount) memberCount.textContent = data.users;

    const dashboardPing = document.getElementById("dashboardPing");
    if (dashboardPing) dashboardPing.textContent = data.ping + "ms";

    const dashboardStatus = document.getElementById("dashboardStatus");
    if (dashboardStatus) dashboardStatus.textContent = data.status;

  } catch (err) {
    console.error("Dashboard Error:", err);
  }
}

updateStatus();
setInterval(updateStatus, 10000);