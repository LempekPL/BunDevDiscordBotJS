const Config = require("../data/config.json");

module.exports.randomColor = () => {
    if (Config.randomColors) {
        let i = Math.floor(Math.random() * Config.randomColors.length);
        return Config.randomColors[i];
    }
    const R = Math.floor(Math.random() * 256);
    const G = Math.floor(Math.random() * 256);
    const B = Math.floor(Math.random() * 256);
    return [R, G, B];
}

module.exports.footerEmbed = (client, embed) => {
    if (Config.settings.subowners.length === 0) {
        embed.setFooter("© " + client.users.cache.get(Config.settings.ownerid).username, client.users.cache.get(Config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(Config.settings.ownerid).username
        Config.settings.subowners.forEach(sub => {
            owners += ` & ${client.users.cache.get(sub).username}`;
        });
        embed.setFooter("© " + owners, client.user.avatarURL());
    }
    embed.setTimestamp();
}