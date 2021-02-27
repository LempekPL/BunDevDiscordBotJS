
module.exports.searchUser = (message, string, returnAuthor = false) => {
        if (message.mentions.users.first() == null) {
            if (string == null) {
                if (returnAuthor) {
                    return message.author;
                } else {
                    return null;
                }
            }
            if (message.guild.members.cache.get(string)) {
                return message.client.users.cache.get(string);
            }
            let zn = false;
            message.guild.members.cache.forEach(member => {
                if (zn) return;
                if (member.user.username.toLowerCase().includes(string.toLowerCase())) {
                    zn = member.user;
                }
            });
            if (!zn) {
                if (returnAuthor) {
                    return message.author;
                } else {
                    return null;
                }
            } else {
                return zn;
            }
        } else {
            return message.mentions.users.first();
        }
};