const { rolesAdd } = require("../config.js");
global.bot.on("guildMemberAdd", member => rolesAdd.filter(r => !member.roles.cache.has(r)).forEach(r => member.roles.add(r)));
