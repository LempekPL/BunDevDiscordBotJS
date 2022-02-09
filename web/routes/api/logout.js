const express = require("express");
const router = express.Router();
const CLIENT_ID = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_CLIENT_ID ? process.env.DEV_DASHBOARD_CLIENT_ID : process.env.DASHBOARD_CLIENT_ID;
const REDIRECT_URI = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_REDIRECT_URL ? process.env.DEV_DASHBOARD_REDIRECT_URL : process.env.DASHBOARD_REDIRECT_URL;

router.post("/", async (req, res, next) => {
    res.clearCookie("discordRefresh");
    res.clearCookie("discordToken");
    res.json({success: true});
});

module.exports = router;