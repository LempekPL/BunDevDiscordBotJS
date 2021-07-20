

let badoszapiimage = async function badoszapiimage(message, args, imagg, suf, us) {
    if (await blockCheck(codename(__dirname), message)) return;
    let i = Math.floor(Math.random() * config.c.length);
    let ce = config.c[i];
    if (cooldown.has(message.author.id)) {
        message.channel.send(`Wait 5 seconds`);
    } else {
        let response = await requester(`http://obrazium.com/v1/${imagg}`, config.tokens.badosz, "buffer");
        let embed = new Discord.MessageEmbed();
        embed.attachFiles([{
            attachment: response,
            name: "content." + suf
        }]);
        embed.setTitle(imagg.charAt(0).toUpperCase() + imagg.slice(1));
        if (us) {
            let user = await searchUser(message, args[0]);
            embed.setDescription(`${message.member} ${us} ${user}`);
        }
        embed.setImage("attachment://content." + suf);
        embed.setColor(ce);
        embed.setFooter("obrazium.com");
        message.channel.send(embed);
        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, 5000);
    }
}