module.exports.run = (bot, message, args, { send }) => {
    if (!args[0]) return send.error("Мыш, укажи команду которую надо включить!");
    const cmd = global.commands.find(c => c.command.name === args[0].toLowerCase());
    if (!cmd) return send.error("Мыш, такой команды нет!");
    if (!cmd.run) return send.error("Мыш, эта команда сломана!");
    if (cmd.command.status) return send.error("Мыш, эта команда уже включена!");
    global.commands[global.commands.indexOf(cmd)].command.status = true;
    send.ok("Всо мыш, команда включена.")
};
module.exports.command = { dm: true, owneronly: true };