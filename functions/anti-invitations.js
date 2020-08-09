const INVITE_PATTERN = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
global.bot.on("message", async message => {
    if (message.author.bot) return; // Боты могут в своих командах отображать ссылки на свои сервера поддержки
    if (!message.member.bannable) return; // Если пользователя невозможно забанить.

    let invites = await Promise.all(
        message.content.split(" ") // Разделяем сообщение.
            .filter(content => INVITE_PATTERN.test(content)) // Фильтруем, чтобы были только инвайты.
            .map(content => global.bot.fetchInvite(content).catch(() => null))
    ); // Преобразуем каждый инвайт в коллекцию о информации инвайта. В случае, если инвайт недействителен то возвращаем null.

    invites = invites
        .filter(i => i) // Очищаем null ( Недействительные инвайты )
        .map(invite => invite.guild.id) // Преобразуем всё в ID серверов приглашений.
        .filter(guildID => guildID !== message.guild.id); // Фильтруем, чтобы сервера не соответствовали тому, куда отправлено.

    if (invites.length === 0) return; // Если нет инвайтов.
    message.delete();
    await message.channel.send("Ну ты мыыыыыш сервера рекламируеш ужас лови бан!").catch(err => err);
    message.member.ban({ reason: "Рекламирует сервера!" });
});