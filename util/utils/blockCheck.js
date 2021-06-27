module.exports.blockCheck = async (client, message, category) => {
    let discatgui = client.dbCache.guilds[message.guild.id].disabledCategory;
    let discatuse = client.dbCache.users[message.author.id].disabledCategory;
    if (discatgui.includes(category)) {
        message.channel.send("Server blocked this category");
        return true;
    } else if (discatuse.includes(category)) {
        message.channel.send("You blocked this category");
        return true;
    } else {
        return false;
    }
}