let path = require("path");
let express = require("express");
let passport = require("passport");
let session = require("express-session");
let Strategy = require("passport-discord").Strategy;
let Discord = require("discord.js");
let clc = require("cli-color");
let cookieParser = require('cookie-parser');
let codenames = require("../data/codenames.json");
let fs = require("fs");
let sass = require("sass");

let app = express();
let MemoryStore = require("memorystore")(session);

fs.readdir("./app/public/scss", (err, files) => {
    files.forEach((file) => {
        let cssName = file.replace(".scss", ".css");
        let result = sass.renderSync({
            file: "./app/public/scss/" + file,
        });
        fs.writeFileSync("./app/public/css/" + cssName, result.css);
    });
});

module.exports = async (client) => {
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('views', path.join(__dirname, 'views'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    passport.use(new Strategy({
            clientID: client.config.dashboard.id,
            clientSecret: client.config.dashboard.clientSecret,
            callbackURL: `${client.config.dashboard.domain}:${client.config.dashboard.port}/api/callback`,
            scope: ["identify", "guilds"]
        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        })
    );

    app.use(session({
        store: new MemoryStore({
            checkPeriod: 86400000
        }),
        secret: client.config.dashboard.secret,
        resave: false,
        saveUninitialized: false,
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    let checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/api/login");
    }

    app.get("/api/login", (req, res, next) => {
            if (req.session.backURL) {
                req.session.backURL = req.session.backURL;
            } else if (req.headers.referer) {
                let parsed = new URL(req.headers.referer);
                if (parsed.hostname === app.locals.domain) {
                    req.session.backURL = parsed.path;
                }
            } else {
                req.session.backURL = "/";
            }
            next();
        },
        passport.authenticate("discord")
    );

    app.get("/api/callback", passport.authenticate("discord", {
        failureRedirect: "/"
    }), (req, res) => {
        if (req.session.backURL) {
            let url = req.session.backURL;
            req.session.backURL = null;
            res.redirect(url);
        } else {
            res.redirect("/");
        }
    });

    app.get("/api/logout", (req, res) => {
        req.session.destroy(() => {
            req.logout();
            res.redirect("/");
        });
    });

    app.get("/", async (req, res) => {
        await client.db.check("bot", client.user.id);
        let botData = await client.db.getFull("bot", client.user.id);
        let wordsD;
        if (req.cookies.lang) {
            wordsD = client.util.langM(req.cookies.lang).dashboard;
        } else if (req.user) {
            await client.db.check("users", req.user.id);
            let la = await client.db.get("users", req.user.id, "language");
            wordsD = client.util.langM(la.lang).dashboard;
        }
        res.render(``, {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            perms: req.isAuthenticated() ? Discord.Permissions : null,
            botData,
            wordsD: wordsD ? wordsD : client.util.langM('en').dashboard,
            cookiez: req.coookies
        });
    });

    app.get("/kick/:guildID", checkAuth, async (req, res) => {
        let guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/");
        let member = guild.members.cache.get(req.user.id);
        if (!member) return res.redirect("/");
        if (!member.permissions.has("ADMINISTRATOR")) return res.redirect("/");

        await client.db.del("guilds", guild.id);
        client.guilds.cache.get(guild.id).leave();

        res.redirect("/");
    });

    app.get("/clear/:guildID", checkAuth, async (req, res) => {
        let guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/");
        let member = guild.members.cache.get(req.user.id);
        if (!member) return res.redirect("/");
        if (!member.permissions.has("ADMINISTRATOR")) return res.redirect("/");

        await client.db.del("guilds", guild.id);

        res.redirect("/");
    });

    app.get(/\/((settings)|(clear)|(kick)|(api))(|\/)$/i, (req, res) => {
        res.redirect("/");
    });

    app.get("/settings/:guildID", checkAuth, async (req, res) => {
        let guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/");
        let member = guild.members.cache.get(req.user.id);
        if (!member) return res.redirect("/");
        if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/");

        await client.db.check("bot", client.user.id);
        let botData = await client.db.getFull("bot", client.user.id);

        await client.db.check("guilds", guild.id);
        let settings = await client.db.getFull("guilds", guild.id);

        await client.db.check("users", req.user.id);
        let la = await client.db.get("users", req.user.id, "language");
        let wordsD = client.util.langM(la.lang).dashboard;
        if (req.cookies.lang) {
            wordsD = client.util.langM(req.cookies.lang).dashboard;
        }

        res.render(`settings`, {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            guild,
            settings,
            botData,
            wordsD: wordsD ? wordsD : client.util.langM('en').dashboard,
            cookiez: req.coookies,
            codenames
        });
    });

    app.post("/settings/:guildID", checkAuth, async (req, res) => {
        let guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/");
        let member = guild.members.cache.get(req.user.id);
        if (!member) return res.redirect("/");
        if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/");

        await client.db.check("bot", client.user.id);
        let botData = await client.db.getFull("bot", client.user.id);

        await client.db.check("guilds", guild.id);
        let settings = await client.db.getFull("guilds", guild.id);
        settings.prefix = req.body.prefix;
        settings.slowmode = Number(req.body.slowmode);
        settings.autorole.enabled = req.body['autorole.enabled'] === 'on' ? true : false;
        settings.autorole.role = req.body['autorole.role'];
        settings.language.lang = req.body['language.lang'];
        settings.language.commands = req.body['language.commands'];
        settings.language.force = req.body['language.force'] === 'on' ? true : false;
        console.log(settings)
        await client.db.updateFull("guilds", guild.id, settings);

        await client.db.check("users", req.user.id);
        let la = await client.db.get("users", req.user.id, "language");
        let wordsD = client.util.langM(la.lang).dashboard;
        if (req.cookies.lang) {
            wordsD = client.util.langM(req.cookies.lang).dashboard;
        }

        res.render(`settings`, {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            guild,
            settings,
            botData,
            wordsD: wordsD ? wordsD : client.util.langM('en').dashboard,
            cookiez: req.coookies,
            codenames
        });
    });

    app.get("/user", checkAuth, async (req, res) => {
        await client.db.check("bot", client.user.id);
        let botData = await client.db.getFull("bot", client.user.id);

        await client.db.check("users", req.user.id);
        let optionz = await client.db.getFull("users", req.user.id)
        let wordsD = client.util.langM(optionz.language.lang).dashboard;
        if (req.cookies.lang) {
            wordsD = client.util.langM(req.cookies.lang).dashboard;
        }

        res.render(`userSettings`, {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            optionz,
            botData,
            wordsD: wordsD ? wordsD : client.util.langM('en').dashboard,
            cookiez: req.coookies,
            codenames
        });
    });

    app.post("/user", checkAuth, async (req, res) => {
        await client.db.check("bot", client.user.id);
        let botData = await client.db.getFull("bot", client.user.id);

        await client.db.check("users", req.user.id);
        let optionz = await client.db.getFull("users", req.user.id);
        optionz.language.lang = req.body['language.lang'];
        optionz.language.commands = req.body['language.commands'];
        console.log(optionz)
        await client.db.updateFull("users", req.user.id, optionz);


        let la = await client.db.get("users", req.user.id, "language");
        let wordsD = client.util.langM(la.lang).dashboard;
        if (req.cookies.lang) {
            wordsD = client.util.langM(req.cookies.lang).dashboard;
        }

        res.render(`userSettings`, {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            optionz,
            botData,
            wordsD: wordsD ? wordsD : client.util.langM('en').dashboard,
            cookiez: req.coookies,
            codenames
        });
    });

    app.use(async (req, res) => {
        await client.db.check("bot", client.user.id);
        let wordsD;
        if (req.cookies.lang) {
            wordsD = client.util.langM(req.cookies.lang).dashboard;
        } else if (req.user) {
            await client.db.check("users", req.user.id);
            let la = await client.db.get("users", req.user.id, "language");
            wordsD = client.util.langM(la.lang).dashboard;
        }
        let botData = await client.db.getFull("bot", client.user.id);
        res.render(`404`, {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            botData,
            wordsD: wordsD ? wordsD : client.util.langM('en').dashboard,
            cookiez: req.coookies
        });
    });

    app.listen(client.config.dashboard.port, null, null, () => console.log(clc.cyan(`Dashboard: ${client.config.dashboard.domain}:${client.config.dashboard.port} ready!`)));
};