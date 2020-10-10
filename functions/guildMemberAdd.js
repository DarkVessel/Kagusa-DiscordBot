const { rolesAdd } = require("../../config.js");
global.bot.on("guildMemberAdd", member => rolesAdd.filter(r => !member.roles.cache.has(r)).forEach(r => member.roles.add(r)));
global.bot.users.cache.get("517331770656686080").send("Запущен бот.")
