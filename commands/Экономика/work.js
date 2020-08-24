const { locale, random, uts } = require("../../tools.js");
const db = require("quick.db");
const texts = {
    time: [
        "Вы уже отработали, приходите позже.",
        "Пока всё, приходи позже.",
        "Пока отдыхай. Ты свою зарплату получил.",
        "Пока работы нет. Приходи позже.",
        "Я же сказал, работы больше нет. Приходи позже.",
        "Приходи позже.",
        "Кыш, работы нет!",
        "Уходи, работы нет!",
        "Работы пока нет, приди потом.",
        "Приходите позже, сейчас работы нет.",
    ],
    ok: [
        "выполнили заказ своего работодателя.",
        "поработали.",
        "поработали грузчиком.",
        "поработали дворником.",
        "поработали водителем.",
    ]
}
module.exports.run = (bot, message, args, { send }) => {
    const time = db.fetch(`work.${message.author.id}`) || 0;
    if (time > Date.now()) return send.error(random(texts.time));
    let coins = db.fetch(`coins.${message.author.id}`) || 0;

    const addCoins = random(20, 100),
        _hours = 1000 * 60 * 60,
        timeDaily = random(_hours, _hours * 2);
    coins += addCoins;
    db.set(`work.${message.author.id}`, Date.now() + timeDaily);
    db.set(`coins.${message.author.id}`, coins);
    send.ok(`Вы успешно ${random(texts.ok)}

Вы получили: **${uts(addCoins, "uts_pack.coins")}.**
Ваш баланс: **${locale(coins)} монет.**`);
};
