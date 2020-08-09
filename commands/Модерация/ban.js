const { uts, toNum, positionStaff } = require("../../tools.js");
const Embeder = require("../../structures/Embeder.js");
const Handler = require("../../structures/Handler.js");
const config = require("../../config.js");
const db = require("quick.db");
module.exports.run = async (bot, message, args, data) => {
    args = args.filter(e => e != "") // Убираем лишние пробелы.
    const { send, rUser } = data;
    if (!data.guildRoles.has(config.banAccess)) data.channelLog.send("Отсутствует роль ban access.");
    if (!message.member.permissions.has("ADMINISTRATOR") && !data.memberRoles.has(config.banAccess)) return send.error("У вас недостаточно прав!")
    if (!message.guild.me.permissions.has("BAN_MEMBERS")) return send.error("У меня нет прав банить людей.");
    if (!args[0]) return send.error("Укажите пользователя/тег/id.");
    if (!rUser) return send.error("Пользователь не найден!");
    if (rUser.id === bot.user.id) return message.channel.send("...")
    if (rUser.id === message.author.id) return send.error("Нельзя забанить самого себя.");
    if (rUser.id === message.guild.owner.id) return send.error("Нельзя дать бан создателю сервера.")
    if (rUser.permissions.has("ADMINISTRATOR")) return send.error("Банить Администратора не лучшая идея.")
    const position = positionStaff(message.member), positionRuser = positionStaff(rUser);
    if (positionRuser >= position) return send.error(`Нельзя забанить человека который ${positionRuser > position ? "выше тебя" : "на ровне с тобой"}.`)
    const sym = args[1] ? args[1].split("").reverse()[0] : "",
        time = toNum(args[1]),
        reason = args.slice(2).join(" ");
    async function ban(time, content, reason2 = "") {
        let a = "**`", b = "`**";
        if (config.forbiddenSymbols.some(e => reason2.includes(e))) { a = ""; b = "" }
        await rUser.send(new Embeder().ok(`Модератор ${message.author} забанил вас на сервере RusTNT на **${!time ? "навсегда" : content}**${reason2 ? ` по причине: ${a}${reason2}${b}` : "."}`)).catch(err => err);
        send.ok(`${rUser} был забанен на **${!time ? "навсегда" : content}**${reason2 ? ` по причине: ${a}${reason2}${b}` : "."}`, { footer: [message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096 })] });
        await rUser.ban({ reason: reason2 });
        if (time) {
            await db.set(`bans.${rUser.id}`, time + Date.now())
            new Handler(rUser.id, time).ban()
        }
    }
    if (!time || isNaN(time)) {
        ban(null, null, args.slice(1).join(" "));
    } else {
        if (["s", "с", "c", "sec", "сек"].some(e => e === sym.toLowerCase())) return ban(time * 1000, uts(time, "uts_pack.time.sec"), reason);
        if (["m", "м", "min", "мин"].some(e => e === sym.toLowerCase())) return ban(60 * time * 1000, uts(time, "uts_pack.time.min"), reason);
        if (["h", "ч", "hours", "час"].some(e => e === sym.toLowerCase())) return ban(60 * 60 * time * 1000, uts(time, "uts_pack.time.hours"), reason);
        if (["d", "д", "day", "день"].some(e => e === sym.toLowerCase())) return ban(60 * 60 * 24 * time * 1000, uts(time, "uts_pack.time.days"), reason);
        if (["w", "н", "week", "неделя"].some(e => e === sym.toLowerCase())) return ban(60 * 60 * 24 * 7 * time * 1000, uts(time, "uts_pack.time.week"), reason);
        if (["y", "г", "year", "год"].some(e => e === sym.toLowerCase())) return ban(60 * 60 * 24 * 7 * 365 * time * 1000, uts(time, "uts_pack.time.years"), reason);
        ban(time, uts(time, "uts_pack.time.ms"), reason);
    }
};