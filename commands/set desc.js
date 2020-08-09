const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.js");
const db = require("quick.db");
module.exports.run = (bot, message, args, { send }) => {
    const des = args.slice(1).join(" ")
    if (!args[0]) args[0] = "";
    switch (args[0].toLowerCase()) {
        case "desc":
            if (!des) return send.error("Укажи описание!");
            if (des.length > 1024) return send.error("Описание не может быть больше 1024 символов.");
            db.set(`profileInfo.${message.author.id}.info`, des);
            send.ok("Вы успешно установили описание.");
            break;
        /*case "site":
            if (!des) return send.error("Укажи сайт!");
            if (!URL_PATTERN.test(des)) return send.error("Это не выглядит как ссылка на сайт.")
            db.set(`profileInfo.${message.author.id}.web`, des);
            send.ok("Вы успешно установили сайт.");
            break;*/
        default:
            message.channel.send(
                new MessageEmbed()
                    .setDescription(`Установка статуса ( Статус будет отображаться в **\`${prefix}profile\`** )`)
                    .addField(`${prefix}set desc`, `Установить описание профиля.\nПример: **\`${prefix}set desc Я какой-то человек.\`**`)
                    // .addField(`${prefix}set site`, `Установить сайт (например, ссылку на ВКонтакте)\nПример: **\`${prefix}set site https://vk.com/...\`**`)
            )
    }
};
module.exports.command = { name: "set" };