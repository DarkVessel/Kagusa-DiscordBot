const { uts, toNum, positionStaff } = require("../../tools.js");
const Embeder = require("../../structures/Embeder.js");
const Handler = require("../../structures/Handler.js");
const config = require("../../config.js");
const db = require("quick.db");
module.exports.run = async (bot, message, args, data) => {
    args = args.filter(e => e != "") // Убираем лишние пробелы.
    const muteRole = data.guildRoles.get(config.muteRole), { send, rUser } = data;
    if (!data.guildRoles.has(config.muteAccess)) data.channelLog.send("Отсутствует роль mute access.");
    if (!message.member.permissions.has("ADMINISTRATOR") && !data.memberRoles.has(config.muteAccess)) return send.error("У вас недостаточно прав!")
    if (!message.guild.me.permissions.has("MANAGE_ROLES")) return send.error("У меня нет прав управлять ролями.");
    if (!args[0]) return send.error("Укажите пользователя/тег/id.");
    if (!rUser) return send.error("Пользователь не найден!");
    if (rUser.id === bot.user.id) return message.channel.send("...")
    if (rUser.id === message.author.id) return send.error("Нельзя дать мут самому себе.");
    if (rUser.id === message.guild.owner.id) return send.error("Нельзя дать мут создателю сервера.")
    if (rUser.permissions.has("ADMINISTRATOR")) return send.error("Выдавать мут Администратору - бесполезно.")
    const position = positionStaff(message.member), positionRuser = positionStaff(rUser);
    if (positionRuser >= position) return send.error(`Нельзя заблокировать человека который ${positionRuser > position ? "выше тебя" : "на ровне с тобой"}.`)
    if (!muteRole) {
        message.channel.send("Произошла ошибка!");
        data.channelLog.send("Отсутствует роль muted.");
        return;
    }
    if (rUser.roles.cache.has(muteRole.id)) return send.error('Пользователь уже не может писать.')
    const sym = args[1] ? args[1].split("").reverse()[0] : "",
        time = toNum(args[1]),
        reason = args.slice(2).join(" ");
    async function mute(time, content, reason2 = "") {
        let a = "**`", b = "`**";
        if (config.forbiddenSymbols.some(e => reason2.includes(e))) { a = ""; b = "" }
        rUser.send(new Embeder().ok(`Модератор ${message.author} замутил вас на **${!time ? "навсегда" : content}**${reason2 ? ` по причине: ${a}${reason2}${b}` : "."}\nВ течении этого времени вы не сможете писать в чате.`)).catch(err => err);
        send.ok(`${rUser} был заблокирован в текстовых каналах на **${!time ? "навсегда" : content}**${reason2 ? ` по причине: ${a}${reason2}${b}` : "."}`, { footer: [message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096 })] });
        await rUser.roles.add(muteRole, { reason: reason2 });
        if (time) {
            await db.set(`mutes.${rUser.id}`, time + Date.now());
            new Handler(rUser.id, time).mute()
        } else db.set(`mutes.${rUser.id}`, 0);
    }
    if (!time || isNaN(time)) {
        mute(null, null, args.slice(1).join(" "));
    } else {
        if (["s", "с", "c", "sec", "сек"].some(e => e === sym.toLowerCase())) return mute(time * 1000, uts(time, "uts_pack.time.sec"), reason);
        if (["m", "м", "min", "мин"].some(e => e === sym.toLowerCase())) return mute(60 * time * 1000, uts(time, "uts_pack.time.min"), reason);
        if (["h", "ч", "hours", "час"].some(e => e === sym.toLowerCase())) return mute(60 * 60 * time * 1000, uts(time, "uts_pack.time.hours"), reason);
        if (["d", "д", "day", "день"].some(e => e === sym.toLowerCase())) return mute(60 * 60 * 24 * time * 1000, uts(time, "uts_pack.time.days"), reason);
        if (["w", "н", "week", "неделя"].some(e => e === sym.toLowerCase())) return mute(60 * 60 * 24 * 7 * time * 1000, uts(time, "uts_pack.time.week"), reason);
        if (["y", "г", "year", "год"].some(e => e === sym.toLowerCase())) return mute(60 * 60 * 24 * 7 * 365 * time * 1000, uts(time, "uts_pack.time.years"), reason);
        mute(time, uts(time, "uts_pack.time.ms"), reason);
    }
};