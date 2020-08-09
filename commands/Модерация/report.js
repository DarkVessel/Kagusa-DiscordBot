const { MessageEmbed } = require("discord.js");
const config = require("../../config.js");
module.exports.run = async (bot, message, args, { send, rUser, guildChannels }) => {
    args = args.join(" ").trim().split(" ")
    if (!args[0]) return send.error("Укажите пользователя/тег/id.");
    if (!rUser) return send.error("Пользователь не найден!");
    if (!args[1]) return send.error("Укажите причину жалобы!");
    if (args.slice(1).join(" ").length > 1024) return send.error("Текст причины должен быть меньше 1024 символов.");
    send.ok(`Вы успешно отправили жалобу на игрока ${rUser}`);
    const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Новый репорт")
        .addField("Автор репорта", `\`${message.author.tag}\`\n(ID: ${message.author.id})\n\`-->\` ${message.author}`)
        .addField(`Предполагаемый нарушитель`, `\`${rUser.user.tag}\`\n(ID: ${rUser.id})\n\`-->\` ${rUser}`)
        .addField("Причина подачи репорта", args.slice(1).join(" "))
        .setThumbnail(rUser.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter(bot.user.username, bot.user.displayAvatarURL());
    guildChannels.get(config.reportChannel).send(embed);
}