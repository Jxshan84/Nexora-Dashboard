const API = "/api/dashboard/stats";

async function requireLogin() {
  try {
    const res = await fetch("/api/user", {
      credentials: "include"
    });

    if (res.status === 401) {
      window.location.href = "/auth/discord";
      return false;
    }

    return true;
  } catch (err) {
    console.error(err);
    window.location.href = "/auth/discord";
    return false;
  }
}

async function loadDashboard() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    if (!data.success) return;

    document.getElementById("servers").textContent = data.bot.servers;
    document.getElementById("users").textContent = data.bot.users;
    document.getElementById("ping").textContent = data.bot.ping + " ms";
    document.getElementById("commands").textContent = data.bot.commands;

    document.getElementById("status").textContent =
      data.bot.status === "Online"
        ? "🟢 Online"
        : "🔴 Offline";

    document.getElementById("database").textContent =
      data.bot.status === "Online"
        ? "Connected"
        : "Disconnected";

    const version = document.getElementById("version");
    if (version) {
      version.textContent = data.bot.node;
    }

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

    if (res.status === 401) return;

    const user = await res.json();

    if (!user.loggedIn) return;

    document.querySelector(".profile span").textContent =
      user.username;

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

    const saved =
      localStorage.getItem("selectedGuild");

    if (saved && guilds.some(g => g.id === saved)) {
      select.value = saved;
    }

  } catch (err) {

    console.error(err);

  }

}
async function loadGuildStats(guildId) {
  if (!guildId) return;

  try {
    const res = await fetch(`/api/guild/${guildId}/stats`);
    const data = await res.json();

    if (!data.success) return;

    setText("guildName", data.guild.name);
    setText("guildMembers", data.guild.members);
    setText("guildChannels", data.guild.channels);
    setText("guildRoles", data.guild.roles);

  } catch (err) {
    console.error("Guild Stats Error:", err);
  }
}

async function loadGuildSettings(guildId) {
  if (!guildId) return;

  try {
    const res = await fetch(`/api/guild/${guildId}`);
    const data = await res.json();

    if (!data.success) return;

    const s = data.settings;

    setValue("prefix", s.prefix || "/");
    setValue("welcomeChannel", s.welcomeChannel || "");
    setValue("leaveChannel", s.leaveChannel || "");
    setValue("autoRole", s.autoRole || "");
    setValue("modLogChannel", s.modLogChannel || "");
    setValue("gemsLogChannel", s.gemsLogChannel || "");
    setValue("ticketCategory", s.ticketCategory || "");

    setValue("automod", String(s.automod || false));
    setValue("antiLink", String(s.antiLink || false));
    setValue("isPremium", String(s.isPremium || false));

  } catch (err) {
    console.error("Settings Load Error:", err);
  }
}

async function saveGuildSettings() {
  const guildId = localStorage.getItem("selectedGuild");

  if (!guildId) {
    alert("Select a server first.");
    return;
  }

  const body = {
    prefix: getValue("prefix"),
    welcomeChannel: getValue("welcomeChannel"),
    leaveChannel: getValue("leaveChannel"),
    autoRole: getValue("autoRole"),
    modLogChannel: getValue("modLogChannel"),
    gemsLogChannel: getValue("gemsLogChannel"),
    ticketCategory: getValue("ticketCategory"),
    automod: getValue("automod") === "true",
    antiLink: getValue("antiLink") === "true",
    isPremium: getValue("isPremium") === "true"
  };

  try {
    const res = await fetch(`/api/guild/${guildId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Settings saved successfully.");
    } else {
      alert("❌ Failed to save settings.");
    }

  } catch (err) {
    alert("❌ Save error.");
  }
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function startUptime() {
  setInterval(() => {
    const uptime = document.getElementById("uptime");
    if (!uptime) return;

    const current = uptime.textContent;

    if (current === "Loading..." || current === "") return;

  }, 1000);
}

document.querySelectorAll("[data-page]").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".page-section").forEach(page => {
      page.classList.remove("active-page");
    });

    const page = document.getElementById(`${button.dataset.page}-page`);

    if (page) {
      page.classList.add("active-page");
    }

  });

});

document.addEventListener("change", e => {

  if (e.target.id !== "serverSelect") return;

  localStorage.setItem("selectedGuild", e.target.value);

  loadGuildStats(e.target.value);
  loadGuildSettings(e.target.value);

});

document.addEventListener("click", e => {

  if (e.target.id === "saveSettings") {
    saveGuildSettings();
  }

});

(async () => {

  const ok = await requireLogin();

  if (!ok) return;

  await loadDashboard();
  await loadUser();
  await loadServers();

  const guildId = localStorage.getItem("selectedGuild");

  if (guildId) {
    await loadGuildStats(guildId);
    await loadGuildSettings(guildId);
  }

  startUptime();

  setInterval(loadDashboard, 5000);

})();

