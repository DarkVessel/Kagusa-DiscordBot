const { positionStaff, randomCode } = require("../../tools.js");
const Handler = require("../../structures/Handler.js");
const config = require("../../config.js");
const db = require("quick.db");
module.exports.run = async (bot, message, args, data) => {
    args = args.filter(e => e != "") // Убираем лишние пробелы.
    const muteRole = data.guildRoles.get(config.muteRole), { send, rUser } = data;
    if (!data.guildRoles.has(config.warnAccess)) data.channelLog.send("Отсутствует роль warn access.");
    if (!message.member.permissions.has("ADMINISTRATOR") && !data.memberRoles.has(config.warnAccess)) return send.error("У вас недостаточно прав!")
    if (!message.guild.me.permissions.has("MANAGE_ROLES")) return send.error("У меня нет прав управлять ролями.");
    if (!args[0]) return send.error("Укажите пользователя/тег/id.");
    if (!rUser) return send.error("Пользователь не найден!");
    if (rUser.id === bot.user.id) return message.channel.send("...")
    if (rUser.id === message.author.id) return send.error("Нельзя дать варн самому себе.");
    if (rUser.id === message.guild.owner.id) return send.error("Нельзя дать варн создателю сервера.")
    const position = positionStaff(message.member), positionRuser = positionStaff(rUser);
    if (positionRuser >= position) return send.error(`Нельзя заварнить человека который ${positionRuser > position ? "выше тебя" : "на ровне с тобой"}.`)
    if (!muteRole) {
        message.channel.send("Произошла ошибка!");
        data.channelLog.send("Отсутствует роль muted.");
        return;
    }
    if (rUser.roles.cache.has(muteRole.id)) return send.error("Этот участник находиться в муте.")
    const codes = []; (db.fetch("warns") || {}).array().forEach(e => e.history.forEach(e => codes.push(e.code)));
    const user = db.fetch(`warns.${rUser.id}`) || { warns: 0, codes: [] };
    const reason = args.slice(1).join(" ");
    user.warns++;
    user.codes.push(randomCode(codes));
    let bans;
    let a = "**`", b = "`**";
    if (config.forbiddenSymbols.some(e => reason.includes(e))) { a = ""; b = "" };
    if (user.warns >= 10) {
        await rUser.send(
            new MessageEmbed()
                .setColor("RED")
                .setDescription(`Вы были забанены на сервере ${message.guild.name} по причине 10 предупреждений.\nВозможно, вы очень часто нарушали правила.`)
                .addField("Причина:", !reason ? "Не указана." : reason)
        ).catch(err => err);
        rUser.ban({ reason: "10 предупреждений." });
        db.delete(`warns.${rUser.id}`);
        bans = true;
    } else {
        db.set(`warns.${rUser.id}`, user);
        const timeMute = user.warns === 1 ? 60000 : (user.warns - 1) * 5 * 60000;
        rUser.send(`Вы получили блокировку в чате на ${user.warns === 1 ? "1 минуту" : `${user.warns * 5} минут`}${reason ? ` по причине ${a}${reason}${b}` : ""}`)
        rUser.roles.add(muteRole, { reason }).then(async () => {
            await db.set(`mutes.${rUser.id}`, Date.now() + timeMute)
            new Handler(rUser.id, timeMute).mute()
        })
    };
    send.ok(`Вы успешно выдали предупреждение игроку ${rUser}${reason ? ` по причине ${a}${reason}${b}` : ""}`);
    if (bans) send.ok(`${rUser} был забанен за 10 предупреждений.`);
};