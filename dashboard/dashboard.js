const API = "/api/dashboard/stats";

async function requireLogin() {
  try {
    const res = await fetch("/api/user", {
      credentials: "include"
    });

    if (res.status === 401) {
      window.location.href = "/auth/discord";
      return;
    }
  } catch {
    window.location.href = "/auth/discord";
  }
}

async function loadDashboard() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    document.getElementById("servers").textContent = data.bot?.servers ?? "0";
    document.getElementById("users").textContent = data.bot?.users ?? "0";
    document.getElementById("ping").textContent = (data.bot?.ping ?? "0") + " ms";
    document.getElementById("status").textContent = "🟢 Online";
    document.getElementById("commands").textContent = data.bot?.commands ?? "0";
    document.getElementById("database").textContent = "Connected";
  } catch (err) {
    console.error(err);
    document.getElementById("status").textContent = "🔴 Offline";
    document.getElementById("database").textContent = "Error";
  }
}

async function loadUser() {
  try {
    const res = await fetch("/api/user", {
      credentials: "include"
    });

    const user = await res.json();

    if (!user.loggedIn) return;

    document.querySelector(".profile span").textContent = user.username;

    if (user.avatar) {
      document.querySelector(".profile img").src =
        `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    }

  } catch (err) {
    console.error(err);
  }
}

async function loadServers() {
  try {
    const res = await fetch("/api/guilds", {
      credentials: "include"
    });

    const guilds = await res.json();

    const select = document.getElementById("serverSelect");

    if (!select) return;

    select.innerHTML = "";

    guilds.forEach(guild => {
      const option = document.createElement("option");
      option.value = guild.id;
      option.textContent = guild.name;
      select.appendChild(option);
    });

  } catch (err) {
    console.error(err);
  }
}

function startUptime() {
  let sec = 0;

  setInterval(() => {
    sec++;

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    document.getElementById("uptime").textContent =
      `${h}h ${m}m ${s}s`;
  }, 1000);
}

document.querySelectorAll("[data-page]").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".page-section").forEach(page => {
      page.classList.remove("active-page");
    });

    const page = document.getElementById(
      `${button.dataset.page}-page`
    );

    if (page) {
      page.classList.add("active-page");
    }

  });

});

document.addEventListener("change", e => {

  if (e.target.id === "serverSelect") {
    localStorage.setItem("selectedGuild", e.target.value);
  }

});

requireLogin();
loadDashboard();
loadUser();
loadServers();
startUptime();

setInterval(loadDashboard, 5000);