const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render(req.directory + '/activity.ejs', {
        lang: res.locals.lang
    });
});

module.exports = router;