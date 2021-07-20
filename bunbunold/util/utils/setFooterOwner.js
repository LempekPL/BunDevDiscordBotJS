module.exports.setFooterOwner = (client, embed) => {
    if (client.config.settings.subowners.length==0) {
        embed.setFooter("© "+client.users.cache.get(client.config.settings.ownerid).username, client.users.cache.get(client.config.settings.ownerid).avatarURL());
    } else {
        let owners = client.users.cache.get(client.config.settings.ownerid).username
        client.config.settings.subowners.forEach(sub => {
            owners+=` & ${client.users.cache.get(sub).username}`;
        });
        embed.setFooter("© "+owners, client.user.avatarURL());
    }
}