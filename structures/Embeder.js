const { MessageEmbed } = require("discord.js");
const { emojis } = require("../config.js");
class Embeder {
    constructor({ channel } = {}) {
        this.channel = channel;
    }
    error(text, settings = {}) {
        if (settings.fields) settings.fields = settings.fields.map(a => { return { name: a[0], value: a[1], inline: Boolean(a[2]) } });
        const embed = new MessageEmbed(settings)
            .setColor("RED")
            .setDescription(`${emojis.no} | ${text}`);
        if (settings.fields) settings.fields.forEach(e => embed.addField(...e));
        if (this.channel) return this.channel.send(embed);
        else return embed;
    }
    ok(text, settings = {}) {
        if (settings.fields) settings.fields = settings.fields.map(a => { return { name: a[0], value: a[1], inline: Boolean(a[2]) } });
        const embed = new MessageEmbed(settings)
            .setColor("GREEN")
            .setDescription(`${emojis.yes} | ${text}`)
        if (settings.footer) embed.setFooter(...settings.footer);
        if (this.channel) return this.channel.send(embed);
        else return embed;
    }
};
module.exports = Embeder;