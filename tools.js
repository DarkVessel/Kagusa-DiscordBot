const config = require("./config.js");
const locale = (num = 0) => parseInt(num).toLocaleString().replace(/,/g, " "); // Разделяет число | Пример: 4001294 => 4 001 294.
const uts_pack = {
    time: {
        ms: ["миллисекундy", "миллисекунды", "миллисекунд"],
        sec: ["секундy", "секунды", "секунд"],
        min: ["минуту", "минуты", "минут"],
        hours: ["час", "часа", "часов"],
        days: ["день", "дня", "дней"],
        week: ["неделю", "недели", "недель"],
        month: ["месяц", "месяца", "месяцев"],
        years: ["год", "года", "лет"]
    },
    time2: {
        ms: ["миллисекундa", "миллисекунды", "миллисекунд"],
        sec: ["секунда", "секунды", "секунд"],
        min: ["минута", "минуты", "минут"],
        hours: ["час", "часа", "часов"],
        days: ["день", "дня", "дней"],
        week: ["неделя", "недели", "недель"],
        month: ["месяц", "месяца", "месяцев"],
        years: ["год", "года", "лет"]
    },
    coins: ["монету", "монеты", "монет"],
};

function uts(UT, ...arr) {
    // Форматирование времени.
    let index = 2;
    if (arr[0].includes("uts_pack")) arr[0] = eval(arr[0]);
    if (Array.isArray(arr[0])) arr = arr[0];
    if (`${UT}`.split("").reverse()[1] === "1") return `${UT} ${arr[2]}`;
    if (`${UT}`.split("").reverse()[0] === "1") return `${UT} ${arr[0]}`;
    if (+`${UT}`.split("").reverse()[0] >= 2 && +`${UT}`.split("").reverse()[0] <= 4) index = 1;
    return `${arr[1] ? locale(UT) : UT} ${arr[index]}`;
};

function positionStaff(member) {
    for (let i = 0; i < config.staffRoles.length; i++) {
        if (!member.roles.cache.has(config.staffRoles[i])) continue;
        return member.roles.cache.get(config.staffRoles[i]).rawPosition;
    }
};

function randomCode(codes) {
    const words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'.split("");
    let result = "";
    for (let i = 0; i < 5; i++) result += random(words);
    if (codes.includes(result)) randomCode(codes);
    else return result;
}

function random(arg, arg2) {
    function randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
    if (Array.isArray(arg)) return arg[Math.floor(Math.random() * arg.length)];
    return randomInteger(arg, arg2);
};

function duration(ms, opt) { // Формат времени.
    let sec, min, hours, days, years;
    years = Math.floor(ms / 1000 / 60 / 60 / 24 / 365)
    ms -= 1000 * 60 * 60 * 24 * years;

    days = Math.floor(ms / 1000 / 60 / 60 / 24)
    ms -= 1000 * 60 * 60 * days;

    hours = Math.floor(ms / 1000 / 60 / 60);
    ms -= 1000 * 60 * 60 * hours;

    min = Math.floor(ms / 1000 / 60);
    ms -= 1000 * 60 * min;

    sec = Math.floor(ms / 1000);
    ms -= 1000 * sec;
    return !opt ? { ms, sec, min, hours, days, years } : `${years ? uts(years, "uts_pack.time2.years") : ""} ${days ? uts(days, "uts_pack.time2.days") : ""} ${hours ? uts(hours, "uts_pack.time2.hours") : ""} ${min ? uts(min, "uts_pack.time2.min") : ""} ${sec ? uts(sec, "uts_pack.time2.sec") : ""} ${!sec && !min && !hours && !days && !years ? uts(ms, "uts_pack.time2.ms") : ""}`.trim()
};

function shuffle(arr) {
    const array = arr.slice();
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    return array;
};

module.exports = {
    uts, positionStaff, random,
    shuffle, randomCode,
    duration, locale, 
};