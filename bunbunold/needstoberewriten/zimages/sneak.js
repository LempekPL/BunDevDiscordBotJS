
module.exports.info = {
    name: "sneak",
    example: "`#PREFIX##COMMAND#`",
    info: "Gives picture",
    tags: ["api","badosz","picture","fun"]
}

module.exports.run = async (client, message, args) => {
    client.util.badoszapiimage(message, args, module.exports.help.name, "png");
}