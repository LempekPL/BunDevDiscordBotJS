
module.exports.searchUser = (message, string, returnAuthor = true) => {
    return new Promise((resolve, reject) => {
        if (message.mentions.users.first() == null) {
            if (string == null || string.startsWith("#")) {
                if (returnAuthor) {
                    return resolve(message.author);
                } else {
                    return reject(message.author);
                }
            }
            if (message.guild.members.cache.get(string) !== undefined) {
                return resolve(message.client.users.cache.get(string));
            }
            let zn = false;
            message.guild.members.cache.forEach(member => {
                if (zn) return;
                if (member.user.username.toLowerCase().includes(string.toLowerCase())) {
                    zn = true;
                    return resolve(member.user);
                }
            });
            if (!zn)
                if (returnAuthor) resolve(message.author);
                else reject(message.author);
        } else {
            resolve(message.mentions.users.first());
        }
    }).catch(err => {
        message.channel.send(err)
    });
};