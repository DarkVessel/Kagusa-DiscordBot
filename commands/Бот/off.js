module.exports.run = (bot, message, args, { send }) => {
    if (!args[0]) return send.error("Мыш, укажи команду которую надо выключить!");
    const cmd = global.commands.find(c => c.command.name === args[0].toLowerCase());
    if (!cmd) return send.error("Мыш, такой команды нет!");
    if (!cmd.run) return send.error("Мыш, эта команда сломана!");
    if (cmd.command.status === false) return send.error("Мыш, эта команда уже выключена!");
    global.commands[global.commands.indexOf(cmd)].command.status = false;
    send.ok("Всо мыш, команда выключена.")
};
module.exports.command = { dm: true, owneronly: true };