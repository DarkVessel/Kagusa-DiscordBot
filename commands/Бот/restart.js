module.exports.run = (bot, message, args, { send }) => send.ok("Перезагружаюссььь!").then(() => process.exit());
module.exports.command = { dm: true, owneronly: true };