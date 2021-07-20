
module.exports.info = {
    name: "dog",
    example: "`#PREFIX##COMMAND#`",
    info: "Gives picture",
    tags: ["api","badosz","picture","fun"]
}

module.exports.run = async (client, message, args) => {
    client.util.badoszapiimage(message, args, module.exports.info.name, "png");
}