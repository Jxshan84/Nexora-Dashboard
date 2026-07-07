const API = "/api/dashboard/stats";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? "";
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function formatUptime(seconds) {
  seconds = Math.floor(seconds || 0);
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

async function loadDashboard() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    setText("servers", data.bot.servers);
    setText("users", data.bot.users);
    setText("ping", data.bot.ping + " ms");
    setText("commands", data.bot.commands);
    setText("uptime", formatUptime(data.bot.uptime));
    setText("status", data.bot.status === "Online" ? "🟢 Online" : "🔴 Offline");
    setText("database", "Connected");
    setText("version", data.bot.node || "v1.0.0");
  } catch (err) {
    setText("status", "🔴 Offline");
    setText("database", "Error");
    console.error(err);
  }
}

async function loadUser() {
  const res = await fetch("/api/user", { credentials: "include" });

  if (res.status === 401) {
    window.location.href = "/auth/discord";
    return false;
  }

  const user = await res.json();

  if (user.loggedIn) {
    document.querySelector(".profile span").textContent = user.username;

    if (user.avatar) {
      document.querySelector(".profile img").src =
        `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    }
  }

  return true;
}

async function loadServers() {
  const res = await fetch("/api/guilds", { credentials: "include" });
  const guilds = await res.json();

  const select = document.getElementById("serverSelect");
  if (!select) return;

  select.innerHTML = "";

  if (!Array.isArray(guilds) || guilds.length === 0) {
    select.innerHTML = `<option value="">No servers found</option>`;
    return;
  }

  guilds.forEach(guild => {
    const option = document.createElement("option");
    option.value = guild.id;
    option.textContent = guild.name;
    select.appendChild(option);
  });

  let saved = localStorage.getItem("selectedGuild");

  if (!saved || !guilds.some(g => g.id === saved)) {
    saved = guilds[0].id;
    localStorage.setItem("selectedGuild", saved);
  }

  select.value = saved;

  await loadGuildStats(saved);
  await loadGuildSettings(saved);
}

async function loadGuildStats(guildId) {
  if (!guildId) return;

  const res = await fetch(`/api/guild/${guildId}/stats`);
  const data = await res.json();

  if (!data.success) return;

  setText("guildName", data.guild.name);
  setText("guildMembers", data.guild.members);
  setText("guildChannels", data.guild.channels);
  setText("guildRoles", data.guild.roles);
}

async function loadGuildSettings(guildId) {
  if (!guildId) return;

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
}

async function saveGuildSettings() {
  const guildId = localStorage.getItem("selectedGuild");

  if (!guildId) {
    alert("Select server first");
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

  const res = await fetch(`/api/guild/${guildId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  alert(data.success ? "✅ Settings saved" : "❌ Save failed");
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

document.addEventListener("change", e => {
  if (e.target.id === "serverSelect") {
    localStorage.setItem("selectedGuild", e.target.value);
    loadGuildStats(e.target.value);
    loadGuildSettings(e.target.value);
  }
});

document.addEventListener("click", e => {
  if (e.target.id === "saveSettings") {
    saveGuildSettings();
  }
});

(async () => {
  await loadDashboard();

  const logged = await loadUser();
  if (!logged) return;

  await loadServers();

  setInterval(loadDashboard, 5000);
})();