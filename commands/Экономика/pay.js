const { random, uts } = require("../../tools.js");
const db = require("quick.db");
const texts = {
    ruserBot: [
        "...",
        "Незя, я пахаю на заводе за шаверму. Начальство убьёт если я возьму деньги.",
        "Нет.",
        "Тебе их деть некуда?",
        "Передай кому-нибуть другому, но не мне.",
        "Xeee, неа. Не возьму.",
        "Неа.",
        "Запрещено.",
        "Я не могу их взять.",
        "Ты не можешь передать деньги мне, я ~~кот~~ бот.",
        "Потрать лучше, чем будешь отдавать мне.",
        "Зачем мне деньги?",
        "Я и без денег могу справится.",
        "Што",
        "...........",
        "No!",
        "Вы, видимо, не того пинганули.",
        "Я мыш, мне деньги не нужны.",
    ],
};
module.exports.run = (bot, message, args, { send, rUser }) => {
    if (!args[0]) return send.error("Укажите пользователя/тег/id.");
    if (!rUser) return send.error("Пользователь не найден!");
    if (rUser.id === bot.user.id) return message.channel.send(random(texts.ruserBot));
    if (rUser.id === message.author.id) return send.error("Нельзя выдать деньги самому себе.");
    if (parseInt(args[1]) <= 0) return send.error("Укажи число больше нуля!");
    if (!args[1]) return send.error("Укажи количество монет, которые хочешь передать.");
    if (isNaN(args[1])) return send.error("Укажи валидное число!");

    let coins = db.fetch(`coins.${message.author.id}`) || 0,
        coinsRuser = db.fetch(`coins.${rUser.id}`) || 0;
    if (parseInt(args[1]) > coins) return send.error("У вас недостаточно монет. Укажите число поменьше.");
    coins -= parseInt(args[1]);
    coinsRuser += parseInt(args[1]);
    db.set(`coins.${message.author.id}`, coins);
    db.set(`coins.${rUser.id}`, coinsRuser);
    send.ok(`Вы успешно передали ${uts(parseInt(args[1]), "uts_pack.coins", true)} игроку ${rUser}`);
}