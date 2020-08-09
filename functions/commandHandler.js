const { prefix, owners, errorLog } = require("../config.js");
const Embeder = require("../structures/Embeder.js");
global.bot.on("message", message => {
    if (!message.content.startsWith(prefix)) return; // Если сообщение без префикса.
    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(" "),
        command = args.shift().toLowerCase(),
        cmd = global.commands.find(e => (e.command.aliases && e.command.aliases.some(a => a.toLowerCase() == command)) || e.command.name.toLowerCase() === command);
    if (!cmd) return;
    if (cmd.command.status === false) return message.channel.send("Команда не работает!")
    if (!cmd.command.dm && message.channel.type === "dm") return message.channel.send("Команды можно использовать только на сервере!")
    if (cmd.command.owneronly && !owners.includes(message.author.id)) return 
    if (message.channel.type != "dm") {
        var guildRoles = message.guild.roles.cache,
            guildMembers = message.guild.members.cache,
            guildChannels = message.guild.channels.cache,
            channelLog = message.guild.channels.cache.get(errorLog),
            memberRoles = message.member.roles.cache,
            rUser = message.mentions.members.first() || guildMembers.get(args[0]) || guildMembers.find(e => e.user.tag == args[0]);
    };
    if (!channelLog) channelLog = { send: function() { console.error("Укажите в config.js в поле errorLog - ID канала куда будут отправляться ошибки бота!!!\nЕсли вы уже указали, то проверьте чтобы бот мог туда писать."); } }
    const send = new Embeder({ channel: message.channel });
    cmd.run(global.bot, message, args, { guildRoles, guildMembers, guildChannels, channelLog, memberRoles, rUser, send });
});