const API = "/api/dashboard/stats";

async function loadDashboard() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    document.getElementById("servers").textContent = data.bot?.servers ?? "0";
    document.getElementById("users").textContent = data.bot?.users ?? "0";
    document.getElementById("ping").textContent = (data.bot?.ping ?? "0") + " ms";
    document.getElementById("status").textContent = "Online";
    document.getElementById("commands").textContent = data.bot?.commands ?? "0";
    document.getElementById("database").textContent = "Connected";
  } catch (err) {
    document.getElementById("status").textContent = "Offline";
    document.getElementById("database").textContent = "Error";
  }
}

function startUptime() {
  let sec = 0;
  setInterval(() => {
    sec++;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    document.getElementById("uptime").textContent = `${h}h ${m}m ${s}s`;
  }, 1000);
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".page-section").forEach(page => {
      page.classList.remove("active-page");
    });

    const page = document.getElementById(`${button.dataset.page}-page`);
    if (page) page.classList.add("active-page");
  });
});

loadDashboard();
startUptime();
setInterval(loadDashboard, 5000);