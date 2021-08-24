const express = require("express");
const router = express.Router();
const CLIENT_ID = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_CLIENT_ID ? process.env.DEV_DASHBOARD_CLIENT_ID : process.env.DASHBOARD_CLIENT_ID;
const REDIRECT_URI = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_REDIRECT_URL ? process.env.DEV_DASHBOARD_REDIRECT_URL : process.env.DASHBOARD_REDIRECT_URL;

router.get("/", async (req, res, next) => {
    if (req.cookies.discordRefresh) {
        res.redirect(req.cookies.backURL);
    } else {
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`);
    }
});

module.exports = router;