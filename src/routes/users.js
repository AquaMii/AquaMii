const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
    res.render(req.directory + '/users.ejs', { user: req.session.user });
});

module.exports = router;