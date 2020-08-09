const Handler = require("../structures/Handler.js");
const db = require("quick.db");
const mutes = db.fetch("mutes");
const bans = db.fetch("bans");
for (let id in mutes) { if (mutes.hasOwnProperty(id) && mutes[id] != 0) new Handler(id, mutes[id] - Date.now()).mute(); };
for (let id in bans) { if (bans.hasOwnProperty(id)) new Handler(id, bans[id] - Date.now()).ban() };