const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    res.redirect('/titles');
});

router.get('/welcome', async (req, res) => {
    res.render(req.directory + '/welcome/gate.ejs', {
        lang: res.locals.lang
    });
});

module.exports = router;