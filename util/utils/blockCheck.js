let path = require("path");

module.exports.blockCheck = async (client, dirName, message) => {
    let discatgui = client.dbCache.guilds[message.guild.id].disabledCategory;
    let discatuse = client.dbCache.users[message.author.id].disabledCategory;
    if (discatgui.includes(path.basename(path.resolve(dirName, '')))) {
        message.channel.send("Server blocked this category");
        return true;
    } else if (discatuse.includes(path.basename(path.resolve(dirName, '')))) {
        message.channel.send("You blocked this category");
        return true;
    } else {
        return false;
    }
}