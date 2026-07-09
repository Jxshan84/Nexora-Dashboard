const BACKEND = "https://nexora-dashboard-klgw.onrender.com";

let currentUser = null;
let currentGuild = null;
let allChannels = [];
let allRoles = [];

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

function notify(message) {
  alert(message);
}

function fillSelect(id, items, placeholder) {
  const select = document.getElementById(id);
  if (!select) return;

  const oldValue = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name || item.id;
    select.appendChild(option);
  });

  if (oldValue) select.value = oldValue;
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });
});

window.addEventListener("load", async () => {
  startLoaderText();

  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  }, 3800);

  await loadDashboard();

  const logged = await loadUser();
  if (!logged) return;

  await loadGuilds();

  setInterval(loadDashboard, 5000);
});

function startLoaderText() {
  const loaderText = document.getElementById("loaderText");
  if (!loaderText) return;

  const messages = [
    "Initializing RUDRA...",
    "Loading Modules...",
    "Connecting Database...",
    "Connecting Discord...",
    "Starting Dashboard..."
  ];

  let index = 0;

  setInterval(() => {
    loaderText.textContent = messages[index % messages.length];
    index++;
  }, 700);
}

async function loadDashboard() {
  try {
    const res = await fetch(`${BACKEND}/api/dashboard/stats`);
    const data = await res.json();
    const bot = data.bot || {};

    setText("status", bot.status === "Online" ? "🟢 Online" : "🔴 Offline");
    setText("ping", `${bot.ping || 0} ms`);
    setText("servers", bot.servers || 0);
    setText("users", bot.users || 0);
    setText("commands", bot.commands || 0);
    setText("ram", `${bot.ram || 0} MB`);
    setText("node", bot.node || "Unknown");
    setText("database", "🟢 Connected");

    setText("ownerServers", bot.servers || 0);
    setText("ownerBotStatus", bot.status || "Offline");
  } catch (err) {
    setText("status", "🔴 Offline");
    setText("database", "🔴 Error");
  }
}

async function loadUser() {
  try {
    const res = await fetch(`${BACKEND}/api/user`, {
      credentials: "include"
    });

    if (res.status === 401) {
      window.location.href = `${BACKEND}/auth/discord`;
      return false;
    }

    const user = await res.json();
    currentUser = user;

    setText("username", user.username || "User");

    const avatar = document.getElementById("avatar");
    if (avatar && user.avatar) {
      avatar.src =
        `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    }

    if (user.owner) {
      document.querySelectorAll(".owner-only").forEach(btn => {
        btn.style.display = "block";
      });

      await loadOwnerServers();
    }

    return true;
  } catch (err) {
    console.log("User load error", err);
    return false;
  }
}

async function loadGuilds() {
  try {
    const res = await fetch(`${BACKEND}/api/guilds`, {
      credentials: "include"
    });

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
    currentGuild = saved;

    await loadGuildData(saved);
  } catch (err) {
    console.log("Guild load error", err);
  }
}

async function loadGuildData(guildId) {
  if (!guildId) return;

  currentGuild = guildId;

  await loadGuildChannels(guildId);
  await loadGuildRoles(guildId);
  await loadGuildSettings(guildId);
  await loadReactionRoles(guildId);
}

async function loadGuildChannels(guildId) {
  try {
    const res = await fetch(`${BACKEND}/api/guild/${guildId}/channels`);
    const data = await res.json();

    if (!data.success) return;

    allChannels = data.channels || [];

    fillSelect("welcomeChannel", allChannels, "Select Welcome Channel");
    fillSelect("leaveChannel", allChannels, "Select Leave Channel");
    fillSelect("modLogChannel", allChannels, "Select Mod Log Channel");
    fillSelect("ticketCategory", allChannels, "Select Ticket Channel");

    fillSelect("rrChannel", allChannels, "Select Channel");
    fillSelect("rrExistingChannel", allChannels, "Select Channel");
  } catch (err) {
    console.log("Channel load error", err);
  }
}

async function loadGuildRoles(guildId) {
  try {
    const res = await fetch(`${BACKEND}/api/guild/${guildId}/roles`);
    const data = await res.json();

    if (!data.success) return;

    allRoles = data.roles || [];

    fillSelect("autoRole", allRoles, "Select Auto Role");
    fillSelect("verifyRole", allRoles, "Select Verification Role");

    fillSelect("rrRole", allRoles, "Select Role");
    fillSelect("rrExistingRole", allRoles, "Select Role");
  } catch (err) {
    console.log("Role load error", err);
  }
}

async function loadGuildSettings(guildId) {
  try {
    const res = await fetch(`${BACKEND}/api/guild/${guildId}`);
    const data = await res.json();

    if (!data.success) return;

    const s = data.settings || {};

    setValue("prefix", s.prefix || "/");
    setValue("welcomeChannel", s.welcomeChannel || "");
    setValue("leaveChannel", s.leaveChannel || "");
    setValue("modLogChannel", s.modLogChannel || "");
    setValue("ticketCategory", s.ticketCategory || "");
    setValue("autoRole", s.autoRole || "");
    setValue("verifyRole", s.verifyRole || "");
    setValue("antiLink", String(s.antiLink || false));
    setValue("antiBot", String(s.antiBot || false));
  } catch (err) {
    console.log("Settings load error", err);
  }
}
// ==============================
// SAVE SETTINGS
// ==============================

async function saveSettings() {

    if (!currentGuild) {
        return notify("Select a server first.");
    }

    const body = {
        prefix: getValue("prefix") || "/",
        welcomeChannel: getValue("welcomeChannel"),
        leaveChannel: getValue("leaveChannel"),
        modLogChannel: getValue("modLogChannel"),
        ticketCategory: getValue("ticketCategory"),
        autoRole: getValue("autoRole"),
        verifyRole: getValue("verifyRole"),
        antiLink: getValue("antiLink") === "true",
        antiBot: getValue("antiBot") === "true"
    };

    try {

        const res = await fetch(`${BACKEND}/api/guild/${currentGuild}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.success) {

            notify("✅ Settings Saved Successfully.");

        } else {

            notify("❌ Failed to save settings.");

        }

    } catch {

        notify("❌ Failed to connect backend.");

    }

}

// ==============================
// REACTION ROLE PREVIEW
// ==============================

function updateReactionPreview() {

    setText(
        "previewTitle",
        getValue("rrTitle") || "Choose your roles"
    );

    setText(
        "previewDescription",
        getValue("rrDescription") || "React below to receive your role."
    );

    setText(
        "previewEmoji",
        getValue("rrEmoji") || "😀"
    );

    const role =
        document.getElementById("rrRole");

    if (role) {

        setText(
            "previewRole",
            role.options[role.selectedIndex]?.text || "Selected Role"
        );

    }

}

[
"rrTitle",
"rrDescription",
"rrEmoji"
].forEach(id=>{

const el=document.getElementById(id);

if(el){

el.addEventListener("input",updateReactionPreview);

}

});

const rrRole=document.getElementById("rrRole");

if(rrRole){

rrRole.addEventListener("change",updateReactionPreview);

}

// ==============================
// CREATE REACTION ROLE
// ==============================

async function createReactionRole(){

if(!currentGuild){

return notify("Select a server first.");

}

const body={

guildId:currentGuild,
channelId:getValue("rrChannel"),
roleId:getValue("rrRole"),
emoji:getValue("rrEmoji"),
title:getValue("rrTitle"),
description:getValue("rrDescription"),
createdBy:currentUser?.id

};

try{

const res=await fetch(
`${BACKEND}/api/reactionrole/create`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(body)

}
);

const data=await res.json();

if(data.success){

notify("✅ Reaction Role Created.");

loadReactionRoles(currentGuild);

}else{

notify(data.message||"Failed.");

}

}catch{

notify("Backend Error.");

}

}

// ==============================
// EXISTING MESSAGE
// ==============================

async function createExistingReactionRole(){

if(!currentGuild){

return notify("Select a server first.");

}

const body={

guildId:currentGuild,
channelId:getValue("rrExistingChannel"),
messageId:getValue("rrExistingMessageId"),
roleId:getValue("rrExistingRole"),
emoji:getValue("rrExistingEmoji"),
createdBy:currentUser?.id

};

try{

const res=await fetch(
`${BACKEND}/api/reactionrole/existing`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(body)

}
);

const data=await res.json();

if(data.success){

notify("✅ Added Successfully.");

loadReactionRoles(currentGuild);

}else{

notify(data.message||"Failed.");

}

}catch{

notify("Backend Error.");

}

}
// ==============================
// LOAD REACTION ROLE LIST
// ==============================

async function loadReactionRoles(guildId){

try{

const res=await fetch(`${BACKEND}/api/reactionrole/${guildId}`);

const data=await res.json();

const list=document.getElementById("reactionRoleList");

if(!list) return;

list.innerHTML="";

if(!Array.isArray(data)||data.length===0){

list.innerHTML=`
<div class="server-item">
No Reaction Roles Found
</div>
`;

return;

}

data.forEach(rr=>{

const div=document.createElement("div");

div.className="server-item";

div.innerHTML=`

<h3>${rr.title||"Reaction Role"}</h3>

<p><b>Emoji:</b> ${rr.emoji}</p>

<p><b>Role ID:</b> ${rr.roleId}</p>

<p><b>Message ID:</b> ${rr.messageId}</p>

<button onclick="deleteReactionRole('${rr._id}')">
🗑 Delete
</button>

`;

list.appendChild(div);

});

}catch(err){

console.log(err);

}

}

// ==============================
// DELETE REACTION ROLE
// ==============================

async function deleteReactionRole(id){

if(!confirm("Delete this Reaction Role?")) return;

try{

await fetch(`${BACKEND}/api/reactionrole/${id}`,{

method:"DELETE"

});

notify("✅ Deleted");

loadReactionRoles(currentGuild);

}catch{

notify("❌ Failed");

}

}

window.deleteReactionRole=deleteReactionRole;

// ==============================
// OWNER PANEL
// ==============================

async function loadOwnerServers(){

try{

const res=await fetch(

`${BACKEND}/api/owner/servers`,

{

credentials:"include"

}

);

const data=await res.json();

if(!data.success) return;

setText("ownerServers",data.total||0);

const list=document.getElementById("ownerServerList");

if(!list) return;

list.innerHTML="";

data.guilds.forEach(guild=>{

const div=document.createElement("div");

div.className="server-item";

div.innerHTML=`

<h3>${guild.name}</h3>

<p>ID : ${guild.id}</p>

<p>Members : ${guild.members}</p>

<p>Owner : ${guild.ownerId}</p>

`;

list.appendChild(div);

});

}catch(err){

console.log(err);

}

}

// ==============================
// EVENTS
// ==============================

document.addEventListener("change",e=>{

if(e.target.id==="serverSelect"){

currentGuild=e.target.value;

localStorage.setItem(

"selectedGuild",

currentGuild

);

loadGuildData(currentGuild);

}

});

document.addEventListener("click",e=>{

switch(e.target.id){

case"saveSettings":

saveSettings();

break;

case"createRR":

createReactionRole();

break;

case"createExistingRR":

createExistingReactionRole();

break;

}

});

// ==============================
// AUTO REFRESH
// ==============================

setInterval(()=>{

if(currentGuild){

loadReactionRoles(currentGuild);

}

},30000);

// ==============================

console.log("✅ RUDRA Dashboard Loaded");