const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
    res.render(`default`, {
        botClient: res.locals.botClient,
        user: null
    });
});

module.exports = router;