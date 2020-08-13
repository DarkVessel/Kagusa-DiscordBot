const { prefix, emojis } = require("../../config.js");
const { MessageEmbed } = require("discord.js");
const { locale } = require("../../tools.js");
const db = require("quick.db");
const fs = require("fs");
if (!fs.existsSync("shopRoles.json")) {
    fs.appendFile("shopRoles.json", "[]", function (err) {
        if (err) console.error(`Произошла ошибка при создании файла shopRoles.json!\nСоздайте его вручную и впишите туда: []\nОшибка:\n` + err)
        else console.log("Файл shopRoles.json создан!");
    })
};
module.exports.run = async(bot, message, args, { send, guildRoles }) => {
    if (!fs.existsSync("shopRoles.json")) return send.error("Произошла ошибка, отсутствует файл shopRoles.json!");

    const shopRoles = require("../../shopRoles.json");

    const coins = db.fetch(`coins.${message.author.id}`) || 0;
    const role = shopRoles[parseInt(args[1]) - 1];
    if (!args[0]) args[0] = "";
    switch (args[0].toLowerCase()) {
        case "buy":
            if (shopRoles.length === 0) return send.error("В магазине 0 ролей!");
            if (args[1] < 1) return send.error("Укажите число больше 0!");
            if (!args[1] || parseInt(args[1]) > shopRoles.length) return send.error(`Укажи номер роли от 1 до ${shopRoles.length}`);
            if (isNaN(args[1])) return send.error("Укажи валидное число.");
            if (!guildRoles.has(role.id)) return send.error(`Произошла ошибка. Роль под номером **${parseInt(args[1])}** отсутствует :[`);
            if (role.coin > coins) return send.error(`У вас недостаточно монет! ${emojis.coins}`);
            message.member.roles.add(role.id).then(() => {
                db.set(`coins.${message.author.id}`, coins - role.coin);
                send.ok(`Вы успешно купили роль <@&${role.id}>`);
            }).catch(() => send.error("При выдачи роли произошла ошибка."))
            break;
        case "sell":
            if (shopRoles.length === 0) return send.error("В магазине 0 ролей!");
            if (args[1] < 1) return send.error("Укажите число больше 0!");
            if (!args[1] || parseInt(args[1]) > shopRoles.length) return send.error(`Укажи номер роли от 1 до ${shopRoles.length}`);
            if (isNaN(args[1])) return send.error("Укажи валидное число.");
            if (!guildRoles.has(role.id)) return send.error(`Произошла ошибка. Роль под номером **${parseInt(args[1])}** отсутствует на сервере :[`);
            if (!message.member.roles.cache.has(role.id)) return send.error("Данной роли нет у вас.");
            message.member.roles.remove(role.id).then(() => {
                db.set(`coins.${message.author.id}`, coins + Math.floor(role.coin / 2));
                send.ok(`Вы успешно продали роль <@&${role.id}>`);
            }).catch(() => send.error("При снятии роли произошла ошибка."));
            break;
        case "set":
            const roleS = message.mentions.roles.first() || guildRoles.get(args[1]) || guildRoles.find(r => "@" + r.name === args.slice(1, -1) || r.name === args.slice(1, -1));
            if (!args[1]) return send.error("Укажите роль!");
            if (!roleS) return send.error("Роль не найдена!");
            if (!args[2]) return send.error("Укажи цену!");
            if (isNaN(args[2])) return send.error("Укажи валидное число!");
            if (args[2] > Number.MAX_SAFE_INTEGER) return send.error(`Цена не может быть больше **\`${locale(Number.MAX_SAFE_INTEGER)}\`**! :0`)
            shopRoles.push({ id: roleS.id, coin: args[2] });
            await fs.writeFileSync('../../shopRoles.json', JSON.stringify(shopRoles, null, 4));
            send.ok(`Роль ${roleS} была добавлена в магазин!`)
        case "delete":
            const mention = message.mentions.roles.first(),
                a = guildRoles.find(r => "@" + r.name === args.slice(1, -1) || r.name === args.slice(1, -1));

            const roleS2 = (mention ? shopRoles.find(r => r.id === mention.id) : null) || shopRoles.find(r => r.id === args[1]) || shopRoles[args[1] - 1] || shopRoles.find(r => r.id === a.id);
            if (!args[1]) return send.error("Укажите роль или позицию!");
            if (!roleS2) return send.error("Роль не найдена!");
            shopRoles.delete(shopRoles.find(r => r.id === roleS.id));
            await fs.writeFileSync('../../shopRoles.json', JSON.stringify(shopRoles, null, 4));
            send.ok(`Роль ${roleS2} была удалена из магазина!`)
        default:
            if (shopRoles.length === 0) return send.error("В магазине 0 ролей!");
            let positions = "",
                roles = "",
                coin = "";
            shopRoles.forEach((r, i) => {
                positions += `[${i + 1}] Роль:\n`;
                roles += `<@&${r.id}>\n`;
                coin += `| ${locale(r.coin)} <:tntmoney:525968032284147733>\n`
            });
            const embedModel = new MessageEmbed()
                .setColor("RED")
                .setTitle("Магазин ролей.")
                .setDescription(`Действие с товаром: **\`${prefix}shop buy/sell <Позиция>\`**`);
            const embeds = [
                new MessageEmbed(embedModel)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .addField(`Позиция`, positions, true)
                    .addField(`Роли`, roles, true)
                    .addField(`Цена`, coin, true)
                    .setFooter(`Компьютерная версия.`, bot.user.displayAvatarURL()),
                new MessageEmbed(embedModel)
                    .addField(`Роли`, shopRoles.map((r, i) => `[${i + 1}] <@&${r.id}> | ${locale(r.coin)} <:tntmoney:525968032284147733>`).join("\n"))
                    .setFooter(`Мобильная версия.`, bot.user.displayAvatarURL())
            ]
            let { clientStatus: userStatus } = message.author.presence;
            if (!userStatus) userStatus = { mobile: true };
            let index = userStatus.mobile ? 1 : 0;
            message.channel.send(embeds[index]).then(msg => {
                const filterDesktop = (reaction, user) => reaction.emoji.name === emojis.pk && user.id === message.author.id;
                const filterMobile = (reaction, user) => reaction.emoji.name === emojis.mobile && user.id === message.author.id;
                const collectorDesktop = msg.createReactionCollector(filterDesktop);
                const collectorMobile = msg.createReactionCollector(filterMobile);
                msg.react(index === 0 ? emojis.mobile : emojis.pk);
                async function collect(num) {
                    await msg.reactions.removeAll();
                    index = num;
                    msg.edit(embeds[index]);
                    msg.react(index === 0 ? emojis.mobile : emojis.pk);
                }
                collectorDesktop.on("collect", () => collect(0));
                collectorMobile.on("collect", () => collect(1));
            });
            break;
    }
}