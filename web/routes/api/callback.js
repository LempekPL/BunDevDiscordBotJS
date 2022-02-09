const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const CLIENT_ID = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_CLIENT_ID ? process.env.DEV_DASHBOARD_CLIENT_ID : process.env.DASHBOARD_CLIENT_ID;
const CLIENT_SECRET = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_CLIENT_SECRET ? process.env.DEV_DASHBOARD_CLIENT_SECRET : process.env.DASHBOARD_CLIENT_SECRET;
const REDIRECT_URI = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_REDIRECT_URL ? process.env.DEV_DASHBOARD_REDIRECT_URL : process.env.DASHBOARD_REDIRECT_URL;
const IS_SECURE = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_IS_HTTPS ? JSON.parse(process.env.DEV_DASHBOARD_IS_HTTPS) : JSON.parse(process.env.DASHBOARD_IS_HTTPS);

router.get("/", async (req, res, next) => {
    if (req.query.code) {
        try {
            const bodyData = {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: req.query.code,
                grant_type: "authorization_code",
                redirect_uri: REDIRECT_URI,
                scope: ["identify", "guilds"],
            }
            const resultData = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                body: new URLSearchParams(bodyData),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            const responseData = await resultData.json();
            const cookie_options = {httpOnly: true, secure: IS_SECURE, sameSite: 'strict'};
            res.cookie('discordToken', responseData.access_token, {maxAge: responseData.expires_in * 1000, ...cookie_options});
            res.cookie('discordRefresh', responseData.refresh_token, {maxAge: responseData.expires_in * 2000, ...cookie_options});

            console.log("req.cookies.backURL", req.cookies.backURL)
            if (req.cookies.backURL) {
                res.redirect(req.cookies.backURL);
            } else {
                res.redirect("/");
            }
        } catch (err) {
            res.redirect("/")
        }
    } else {
        res.redirect("/")
    }
});

module.exports = router;