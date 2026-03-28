const express = require('express');
const { pool } = require('../database');

const router = express.Router();

router.get('/me', async (req, res) => {
    res.render(req.directory + '/users.ejs', {
        lang: res.locals.lang,
        user: req.user
    });
});

router.get('/:pnid', async (req, res) => {
    const { pnid } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM peoples WHERE pnid = $1 LIMIT 1',
            [pnid]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('User not found');
        }

        res.render(req.directory + '/users.ejs', {
            lang: res.locals.lang,
            users: result.rows[0],
            user: req.user
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;