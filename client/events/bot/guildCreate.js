let Discord = require('discord.js');

module.exports = async (client, guild) => {
    await client.util.logger("guild", process.env.WEBHOOK_GUILD, {guild, type: "joined"})
}