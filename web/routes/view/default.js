const express = require("express");
const router = express.Router();
const Discord = require("discord.js");

router.get("/", async (req, res, next) => {
    res.render(`default`, {
        Discord,
        sortingType: req.cookies.sortingType ?? "a-z",
        sortingEditable: req.cookies.sortingEditable ?? false,
        botClient: req.botClient,
        discordUser: req.discordUser ?? null
    });
});

module.exports = router;