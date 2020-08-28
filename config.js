module.exports = {
    forbiddenSymbols: ["~~", "<@", "<#", "*", "`", "__", "||", "<:"], // Спец. символы, если бот их заметит он автоматом отключит `такую рамку.`
    prefix: "k!", // Префикс бота.
    guildID: "577516754662719498", // Сервер бота.
    errorLog: "741669463136665702", // Канал с ошибками в боте.
    muteAccess: "741665330123767828", // Роль с правом на мут.
    banAccess: "741665384188608556", // Роль с правом на бан.
    kickAccess: "741665576518418522", // Роль с правом на кик.
    clearAccess: "741665519945515088", // Роль с правом на использование clear.
    warnAccess: "741665431286185984", // Роль с правом на использовании warn.
    shopSetAccess: "715643929961169047", // Роль с правами на shop set-delete
    muteRole: "741666540608553020", // Роль мута.
    rolesAdd: ["679315215011020839", ], // Роли, которые будут выдаваться при входе на сервер. Писать в "кавычках", "через запятую", "ID ролей."
    reportChannel: "734701140695973988",
    owners: ["502881645792067624", "517331770656686080"], // Овнеры бота.
    staffRoles: ["734459134992449637", "686506246278217749", "679319669932556300", "689826267813511228"], // Стафф Роли. Писать нужно строго от самого высшего до самого низкого!!!
    emojis: { // Эмоджи, который бот будет использовать.
        yes: "✅",
        no: "🚫",
        br: {
            start: ['🎰', '🎰', '🎰'], // Эмоджи которые будут при старте в br
            skip: "⏭️", // Реакция, при нажатии на которую пропускается анимация вращения.
            end: ["<:9166_online:703027230913069057>", "<:7907_DND:703027214995947580>", "<:3929_idle:703027197442785332>"], // Эмоджи которые будут вертется в br. ( 3 штуки!!! )
        },
        mobile: "📲",
        pk: "🖥️",
        coins: "<:Yen:742031033599524944>"
    },
}
