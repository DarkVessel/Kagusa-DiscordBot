const { errorLog, emojis } = require("../config.js");
const { uts } = require("../tools.js");
const commandFolder = "commands";
const fs = require("fs");

const channel = global.bot.channels.cache.get(errorLog);
if (!channel) console.error("Укажите в config.js в поле errorLog - ID канала куда будут отправляться ошибки бота!!!\nЕсли вы уже указали, то проверьте чтобы бот мог туда писать.");
let commandLoading = 0, commandLoadingError = 0;

function check(file, name, path) {
    if (!("run" in file)) {
        console.error(`В команде ${name} отсутствует экспорт run. Команда не загружена.`);
        commandLoadingError++; commandLoading -= 2;
        file.command = {
            name: name.slice(0, -3),
            status: false
        };
    };
    if (!("command" in file) || !file.command.name) {
        if (!("command" in file)) file.command = { name: name.slice(0, -3) };
        else file.command.name = name.slice(0, -3);
    }
    file.command.path = path;
    global.commands.push(file);
    commandLoading++;
};

function sendError(fileName, error) {
    global.commands.push({ command: { name: fileName.slice(0, -3), status: false } });
    if (!channel) return;
    channel.send(`${emojis.no} | **Команда \`${fileName.slice(0, -3)}\` не была загружена!**\n${"```prolog\n" + error.stack + "\n```"}`);
}
if (!fs.existsSync(`./${commandFolder}/`)) {
    console.error(`Команды не были загружены из-за отсутствия папки ${commandFolder}!`);
    if (channel) channel.send(`${emojis.no} | **Команды не были загружены из-за отсутствия папки \`${commandFolder}\`!**`);
} else {
    fs.readdirSync(`./${commandFolder}`)
        .forEach(folder => {
            try {
                const path = `../${commandFolder}/${folder}`;
                if (!folder.endsWith(".js")) return;
                const cmd = require(path);
                check(cmd, folder, path);
            } catch (error) {
                sendError(folder, error);
                commandLoadingError++; commandLoading--;
                console.error(error.stack);
            }
            try {
                fs.readdirSync(`./${commandFolder}/${folder}/`)
                    .filter(file => file.endsWith(".js"))
                    .forEach(file => {
                        try {
                            const path = `../${commandFolder}/${folder}/${file}`;
                            const cmd = require(path);
                            check(cmd, file, path);
                        } catch (err) {
                            sendError(file, error);
                            commandLoadingError++; commandLoading--;
                            console.error(error.stack);
                        }
                    });
            } catch (e) { }
        });
    const a = commandLoading === 1 ? "a" : "o",
        b = commandLoadingError === 1 ? 'a' : 'o';
    console.log(`Был${a} загружен${a} ${uts(commandLoading, "команда", "команды", "команд")} !`);
    if (commandLoadingError) console.log(`Не был${b} загружен${b} из-за ошибок ${uts(commandLoadingError, "команда", "команды", "команд")}!`);
};