const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const sass = require("sass");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
const CliCol = require("cli-color");
const CLIENT_ID = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_CLIENT_ID ? process.env.DEV_DASHBOARD_CLIENT_ID : process.env.DASHBOARD_CLIENT_ID;
const CLIENT_SECRET = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_CLIENT_SECRET ? process.env.DEV_DASHBOARD_CLIENT_SECRET : process.env.DASHBOARD_CLIENT_SECRET;
const IS_SECURE = JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_IS_HTTPS ? JSON.parse(process.env.DEV_DASHBOARD_IS_HTTPS) : JSON.parse(process.env.DASHBOARD_IS_HTTPS);

module.exports = (client) => {
    fs.readdir("./web/public/sass", (err, files) => {
        if (!files) return;
        files.forEach((file) => {
            let cssName = file.replace(".scss", ".css");
            let result = sass.renderSync({
                file: "./web/public/sass/" + file,
            });
            fs.writeFileSync("./web/public/css/" + cssName, result.css);
        });
    });

    const app = express();
    app.set("port", JSON.parse(process.env.DEV) && process.env.DEV_DASHBOARD_PORT ? process.env.DEV_DASHBOARD_PORT : process.env.DASHBOARD_PORT || "3000");
    app.set("views", path.join(__dirname, "views"));
    // view engine setup
    app.set("view engine", "ejs");
    app.engine("html", require("ejs").renderFile);
    // middleware setup
    app.use(express.json());
    app.use(cookieParser());
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "script-src": [
                    "'self'",
                    "https://ka-f.fontawesome.com",
                    "https://kit.fontawesome.com",
                ],
                "connect-src": ["'self'", "https://ka-f.fontawesome.com"],
                "img-src": ["'self'", "cdn.discordapp.com"],
            },
        },
    }));
    app.use(express.static(path.join(__dirname, "public")));
    app.use(loadClient(client));

    // view
    app.use("/", getData, require("./routes/view/default"));
    // app.use("/guild", require("./routes/view/guild"));
    // app.use("/user", require("./routes/view/guild"));
    app.use("/changelog", require("./routes/view/changelog"));
    // api
    app.use("/login", require("./routes/api/login"));
    app.use("/logout", require("./routes/api/logout"));
    app.use("/callback", require("./routes/api/callback"));

    app.use(async (req, res) => {
        res.sendStatus(404)
    });

    return app.listen(app.get("port"), () => {
        console.log(CliCol.cyan(`Dashboard: listening on port ${app.get("port")} ready!`));
    })
}

async function getData(req, res, next) {
    if (req.cookies?.discordToken) {
        const userResult = await fetch("https://discord.com/api/users/@me", {
            headers: {
                authorization: `Bearer ${req.cookies.discordToken}`,
            },
        });
        const guildResult = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: {
                authorization: `Bearer ${req.cookies.discordToken}`,
            },
        });
        const userData = await userResult.json();
        const guildData = await guildResult.json();
        req.discordUser = userData;
        req.discordUser.guilds = guildData;
        res.cookie("backURL", req.url);
        next();
    } else {
        if (req.cookies?.discordRefresh) {
            await refreshToken(req, res, next);
        } else {
            next();
        }
    }
}

async function refreshToken(req, res, next) {
    const bodyData = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: req.cookies.discordRefresh,
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
    next();
}

function loadClient(client) {
    return (req, res, next) => {
        req.botClient = client;
        next();
    }
}