
module.exports.info = {
    name: "poke",
    example: "`#PREFIX##COMMAND#` or `#PREFIX##COMMAND# <userid/mention/username>`",
    info: "Gives picture with title",
    tags: ["api","badosz","picture","fun","<3"]
}

module.exports.run = async (client, message, args) => {
    client.util.badoszapiimage(message, args, module.exports.info.name, "gif", "poked");
}