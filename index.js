const startBoolean = true;
if (startBoolean) {
    console.log("Kagusa | Запуск проекта...");
    const fs = require("fs");
    if (!fs.existsSync(".env")) {
        fs.appendFile(".env", "TOKEN=", function (err) {
            if (err) console.error(`Произошла ошибка при создании файла .env!\nСоздайте его вручную и впишите TOKEN=Токен_Вашего_Бота\nОшибка:\n` + err + "Kagusa | Остановка проекта...")
            else console.log("Файл .env создан!\nПожалуйста, впишите туда: TOKEN=Токен_Вашего_Бота\nKagusa | Остановка проекта...")
            process.exit();
        })
    } else {
        require("dotenv").config()
        const Discord = require("discord.js");
        const { uts } = require("./tools.js");
        require("./prototype.js")
        global.bot = new Discord.Client(); // Клиент Дискорд бота.
        global.commands = [];
        global.bot.login(process.env.TOKEN);
        global.bot.on("ready", () => {
            if (!fs.existsSync("./functions/")) console.error("Отсутствует папка functions!");
            else {
                const files = fs
                    .readdirSync("./functions/") // Обращение к папке.
                    .filter(file => file.endsWith(".js")); // Фильтрация файлов.
                let i = files.length;
                let iErr = 0;
                files.forEach(file => {
                    // Перечисление.
                    try {
                        require("./functions/" + file);
                    } catch (err) {
                        i--; iErr++;
                        console.error(err.stack);
                    }
                });
                console.log(`Загружен${i >= 2 || !i ? "о" : ""} ${uts(i, "файл", "файла", "файлов")}!${iErr >= 1 ? `\n${uts(iErr, "файл", "файла", "файлов")} с ошибками.` : ""}`);
            }
        })
    }
} else {
    console.log("WARN | Запуск проекта отменён.");
}