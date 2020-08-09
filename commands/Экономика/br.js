const { uts, random, shuffle } = require("../../tools.js");
const { MessageEmbed } = require('discord.js');
const { emojis } = require("../../config.js");
const db = require("quick.db");
let arrBool = [true, false],
    wins = 0 // Сколько раз было побед подряд.

module.exports.run = (bot, message, args, { send }) => {
    const coins = db.fetch(`coins.${message.author.id}`);
    if (!coins) return send.error("У вас нет монет.");
    if (args[0] < 1) return send.error("Укажи число больше нуля!");
    if (!args[0]) return send.error("Укажите ставку.");
    if (isNaN(args[0])) return send.error('Укажите валидное число.')
    args[0] = parseInt(args[0]);
    if (args[0] > coins) return send.error("У вас недостаточно средств.");
    let addCoins,
        clots = [random(emojis.br.end), random(emojis.br.end), random(emojis.br.end)],
        clotsPlay = emojis.br.start.slice();
    if (random(arrBool)) {
        wins++; // Прибавляем один выигрыш.
        if (wins >= 3) arrBool = arrBool.reverse(); // Если выигрышов уже 3 или больше трёх - перемешиываем массив.
        if (emojis.br.end.some(e => clots.filter(c => c === e).length === 2)) addCoins = args[0];
        else if (emojis.br.end.some(e => clots.filter(c => c === e).length === 3)) addCoins = args[0] * 5;
    } else wins = 0;
    if (!addCoins) clots = shuffle(emojis.br.end);
    db.set(`coins.${message.author.id}.tnt`, !addCoins ? coins - args[0] : coins + addCoins);
    const embed = new MessageEmbed()
        .setColor('YELLOW')
        .setTitle('Крутим барабан-н....')
        .setDescription(clotsPlay.join(" | "));
    message.channel.send(embed).then(msg => {
        if (emojis.br.skip) msg.react(emojis.br.skip);

        const filter = (reaction, user) => reaction.emoji.name === emojis.br.skip && user.id === message.author.id;
        const collector = msg.createReactionCollector(filter);
        let index = 0;

        const interval = setInterval(() => {
            if (index >= 2) stop();
            clotsPlay[index] = clots[index];
            embed.setDescription(clotsPlay.join(" | "));
            msg.edit(embed);
            index++;
        }, 2000);

        collector.on("collect", () => { clotsPlay = clots; stop(); embed.setDescription(clotsPlay.join(" | ")); msg.edit(embed) });

        function stop() {
            clearInterval(interval);
            collector.stop();
            msg.reactions.removeAll()
            embed.setTitle(`Вы ${!addCoins ? "проиграли" : "выиграли"} ${uts(!addCoins ? args[0] : addCoins, 'uts_pack.coins', true)}.`);
            embed.setColor(!addCoins ? 'RED' : "GREEN");
        }
    });
};