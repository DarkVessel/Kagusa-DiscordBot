console.log(`${global.bot.user.tag} запущен!`);
global.bot.generateInvite(["ADMINISTRATOR"]).then(link => console.log(link))