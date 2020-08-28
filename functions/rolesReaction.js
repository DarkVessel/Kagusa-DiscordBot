const { rolesReaction: reactions } = require("../config.js");
const channel = global.bot.channels.cache.get(reactions.channel);
if (!channel) return console.error(`Отсутствует канал реакций! Укажите ID канала в файле config.js, в поле "rolesReaction.channel"`);
for (const msgID in reactions.msg) {
    if (reactions.msg.hasOwnProperty(msgID)) channel.messages.fetch(reactions.msg[msgID]).catch(err => err);
};

global.bot.on("messageReactionAdd", (r, user) => {
    const _a = (r.emoji.id in reactions.r) ? "id" : (r.emoji.name in reactions.r) ? "name" : "";
    if (!(r.message.id in reactions.msg) || !_a) return;
    const member = r.message.guild.member(user.id);
    const role = reactions.msg[r.message.id][r.emoji[_a]];
    if (role) member.roles.add(role).catch(err => err);
});
global.bot.on("messageReactionRemove", (r, user) => {
    const _a = (r.emoji.id in reactions.r) ? "id" : (r.emoji.name in reactions.r) ? "name" : "";
    if (!(r.message.id in reactions.msg) || !_a) return;
    const member = r.message.guild.member(user.id);
    const role = reactions.msg[r.message.id][r.emoji[_a]];
    if (role) member.roles.remove(role).catch(err => err);
});