const db = require("quick.db");
const config = require("../config.js");
class Handler {
    constructor(memberid, time) {
        this.memberid = memberid;
        this.time = time;
    }
    mute() {
        setTimeout(async () => {
            db.delete(`mutes.${this.memberid}`);
            const guild = global.bot.guilds.cache.get(config.guildID);
            if (!guild) return;
            const member = guild.member(this.memberid);
            if (!member) return;
            member.roles.remove(config.muteRole, { reason: "Время наказания истекло." });
        }, this.time);
    }
    ban() {
        setTimeout(async () => {
            db.delete(`bans.${this.memberid}`);
            const guild = global.bot.guilds.cache.get(config.guildID);
            if (!guild) return;
            guild.members.unban(this.memberid, { reason: "Истекло время." })
        }, this.time);
    }
}
module.exports = Handler