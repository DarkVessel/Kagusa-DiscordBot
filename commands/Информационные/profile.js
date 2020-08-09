const { prefix, emojis } = require("../../config.js");
const { MessageEmbed } = require("discord.js");
const { locale } = require("../../tools.js");
const db = require("quick.db");
module.exports.run = (bot, message, args, { rUser }) => {
    if (!rUser) rUser = message.member;
    const coins = db.fetch(`coins.${rUser.id}`) || 0,
        profileInfo = db.fetch(`profileInfo.${rUser.id}`) || {};
    message.channel.send(
        new MessageEmbed()
            //.setColor("RED")
            .setThumbnail(rUser.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(rUser.user.tag, rUser.user.displayAvatarURL({ dynamic: false }))
            .setDescription(!profileInfo.info ? "Описание не установлено." : profileInfo.info)
            .addField(`Деньги`, `Монет: ${locale(coins)} ${emojis.coins}`, true)
            //.addField(`Личный сайт`, !profileInfo.web ? "Не указан." : profileInfo.web)
            .setFooter(`${bot.user.username} | Установкa описания: ${prefix}set desc`, bot.user.displayAvatarURL())
            .setTimestamp()
    );
}