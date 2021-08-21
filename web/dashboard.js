const path = require("path");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const Discord = require("discord.js");
const clc = require("cli-color");
const cookieParser = require('cookie-parser');
const fs = require("fs");
const sass = require("sass");

fs.readdir("./web/public/scss", (err, files) => {
    files.forEach((file) => {
        let cssName = file.replace(".scss", ".css");
        let result = sass.renderSync({
            file: "./web/public/scss/" + file,
        });
        fs.writeFileSync("./web/public/css/" + cssName, result.css);
    });
});

module.exports = (client) => {
    const app = express();

}