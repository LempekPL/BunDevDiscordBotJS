module.exports.blockCheck = async (client, message, category) => {
    let discatgui = client.quickCache.guilds[message.guild.id].disabledCategory;
    let discatuse = client.quickCache.users[message.author.id].disabledCategory;
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