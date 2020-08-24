const { locale, random, duration, uts } = require("../../tools.js");
const timezone = require("strftime").timezone(180);
const db = require("quick.db");
const texts = {
    time: [
        "Не так быстро! Вы уже забирали ежедневную награду.",
        "Халявы много не бывает, приходите позже.",
        "Не наглей, приходи позже.",
        "Вы пришли за новой порцией? А её нет, приходите позже.",
        "Вы уже забирали свою ежедневную награду.",
    ],
    ok: [
        "Бесплатных денег не бывает....а нет, бывает.",
        "Халявы не бывает...а нет, бывает!",
        "Держи, используй с умом.",
        "На, возьми на пиво или ещё что-то.",
        "На хлепушек, удачи.",
        "О, ты пришёл. На, возьми свою ежедневную награду.",
        "Проблемы с деньгами? Ладно, бери.",
        "Опа, а вот и халява.",
        "Ладно, бери. Только не наглей.",
        "Не отдам... ладно-ладно, бери.",
        "А что я должен сказать? Бери уж.",
    ]
};
module.exports.run = (bot, message, args, { send }) => {
    const time = db.fetch(`daily.${message.author.id}`) || 0;
    if (time > Date.now()) return send.error(`${random(texts.time)}

Новая порция в: **${timezone("%F • %T", new Date(time))}**
Осталось: **${duration(time - Date.now(), true)}.**
`);
    let coins = db.fetch(`coins.${message.author.id}`) || 0;

    const addCoins = random(250, 500),
        _hours = 1000 * 60 * 60,
        timeDaily = random(_hours * 12, _hours * 24);

    coins += addCoins;
    db.set(`daily.${message.author.id}`, Date.now() + timeDaily);
    db.set(`coins.${message.author.id}`, coins);
    send.ok(`${random(texts.ok)}

Вы получили: **${uts(addCoins, "uts_pack.coins")}.**
Ваш баланс: **${locale(coins)} монет.**
**----------------------------------------------------------**
Новая порция в: **${timezone("%F • %T", new Date(Date.now() + timeDaily))}**
Осталось: **${duration(timeDaily, true)}.**
`);
};
