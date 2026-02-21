const express = require('express');

const router = express.Router();

router.get('/me', async (req, res) => {
    res.render(req.directory + '/me.ejs', { user: req.session.user });
});

module.exports = router;