let db = require("../db.js");

module.exports.blockCheck = async (type, message) => {
    let discatgui = await db.get("guilds", message.guild.id, "disabledCategory");
    let discatuse = await db.get("users", message.author.id, "disabledCategory");
    if (discatgui.includes(type)) {
        message.channel.send("Server blocked this category");
        return true;
    } else if (discatuse.includes(type)) {
        message.channel.send("You blocked this category");
        return true;
    } else {
        return false;
    }
}