const Embeder = require("../../structures/Embeder.js");
const { positionStaff } = require("../../tools.js");
const config = require("../../config.js");
module.exports.run = async (bot, message, args, data) => {
    args = args.filter(e => e != "") // Убираем лишние пробелы.
    const { send, rUser } = data;
    if (!data.guildRoles.has(config.kickAccess)) data.channelLog.send("Отсутствует роль kick access.");
    if (!message.member.permissions.has("ADMINISTRATOR") && !data.memberRoles.has(config.kickAccess)) return send.error("У вас недостаточно прав!")
    if (!message.guild.me.permissions.has("KICK_MEMBERS")) return send.error("У меня нет прав кикать людей.");
    if (!args[0]) return send.error("Укажите пользователя/тег/id.");
    if (!rUser) return send.error("Пользователь не найден!");
    if (rUser.id === bot.user.id) return message.channel.send("...")
    if (rUser.id === message.author.id) return send.error("Нельзя кикнуть самого себя.");
    if (rUser.id === message.guild.owner.id) return send.error("Нельзя дать кик создателю сервера.")
    if (rUser.permissions.has("ADMINISTRATOR")) return send.error("Кикать Администратора не лучшая идея.")
    const position = positionStaff(message.member), positionRuser = positionStaff(rUser);
    if (positionRuser >= position) return send.error(`Нельзя кикнуть человека который ${positionRuser > position ? "выше тебя" : "на ровне с тобой"}.`)
    const reason = args.slice(1).join(" ");
    let a = "**`", b = "`**";
    if (config.forbiddenSymbols.some(e => reason.includes(e))) { a = ""; b = "" }
    await rUser.send(new Embeder().ok(`Модератор ${message.author} кикнул вас${reason ? ` по причине: ${a}${reason}${b}` : "."}`)).catch(err => err);
    await rUser.kick(reason);
    send.ok(`${rUser} был кикнут **${reason ? ` по причине: ${a}${reason}${b}` : "."}`, { footer: [message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096 })] });
};