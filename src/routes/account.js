const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../database');

const router = express.Router();

router.get('/login', async (req, res) => {
    res.render(req.directory + '/account/login.ejs');
});

router.get('/register', async (req, res) => {
    res.render(req.directory + '/account/register.ejs');
});

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.render(req.directory + '/404.ejs');
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
        [username, hash, email]
    );
        
    res.redirect('/account/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rowCount === 0) {
        return res.send('Username not found.');
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) {
        return res.send('Wrong password.');
    }

    req.session.user = {
        id: user.rows[0].id,
        username: user.rows[0].username
    };

    res.redirect('/');
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;