const tools = require("../../tools.js");
const Discord = require("discord.js");
const { inspect } = require("util");
const { MessageEmbed } = Discord;
module.exports.run = async (bot, message, args, data) => {
    try {
        const evaled = await eval(args.join(" "));
        message.channel.send(inspect(evaled, { depth: 0, maxArrayLength: 50 }), { code: "js" }).catch(() => { });
    } catch (error) { message.channel.send(error, { code: "js" }).catch(() => { }); }
};
module.exports.command = {
    name: 'ev',
    aliases: ['>'],
    owneronly: true,
    dm: true
};