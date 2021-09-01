const express = require("express");
const router = express.Router();
const Discord = require("discord.js");

router.get("/", async (req, res, next) => {
    res.render(`default`, {
        Discord,
        editableOnly: req.cookies.editableOnly ?? false,
        botClient: req.botClient,
        discordUser: req.discordUser ?? null
    });
});

module.exports = router;