const express = require('express');

const router = express.Router();

router.get('/me', async (req, res) => {
    res.render(req.directory + '/users.ejs');
});

module.exports = router;