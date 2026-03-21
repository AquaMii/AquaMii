const express = require('express');

const router = express.Router();

router.get('/my_news', async (req, res) => {
    res.render(req.directory + '/notifications.ejs', {
        lang: res.locals.lang
    });
});

module.exports = router;