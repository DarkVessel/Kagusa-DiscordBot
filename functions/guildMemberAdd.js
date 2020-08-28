const { rolesAdd } = require("../../config.js");
global.bot.on("guildMemberAdd", member => rolesAdd.filter(r => !member.roles.cache.has(r)).forEeach(r => member.roles.add(r)));
