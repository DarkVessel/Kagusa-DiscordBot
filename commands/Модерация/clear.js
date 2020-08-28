const { uts } = require("../../tools.js");
const config = require("../../config.js");
module.exports.run = async (bot, message, args, data) => {
    args = args.filter(e => e != "") // Убираем лишние пробелы.
    if (!data.guildRoles.has(config.clearAccess)) data.channelLog.send("Отсутствует роль clear access.");
    if (!message.member.permissions.has("ADMINISTRATOR") && !data.memberRoles.has(config.clearAccess)) return send.error("У вас недостаточно прав!")
    if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return send.error("У меня нет прав управлять сообщениями.");
    if (!args[0] || args[0] <= 0) return send.error("Укажите число от 1.\nПредупреждение! Бот не может слишком часто, слишком много удалять сообщений.\nИ не может удалять сообщения которым старше 14 лет. Таковы ограничения Дискорда.")
    if (isNaN(args[0])) return send.error("Укажите валидное число.");
    args[0] = parseInt(args[0]);
    await message.delete();
    new Promise(resolve => {
        async function bulkDelete(count) {
            if (count <= 0) return resolve();
            if (count <= 100) {
                await message.channel.bulkDelete(count).catch(() => {});
                resolve();
            }
            else {
                await message.channel.bulkDelete(100).catch(() => { });
                bulkDelete(count - 100);
            }
        };
        bulkDelete(args[0]);
    })
    send.ok(`Вы успешно ( возможно ) удалили ${uts(args[0], "сообщение", "сообщения", "сообщений")}.`);
}
module.exports.command = {
    name: "clear",
    aliases: ["cleart", "cleartnt"]
}