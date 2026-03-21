const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { pool } = require('../database');
const logger = require('../logger');

const router = express.Router();

router.get('/register', async (req, res) => {
    res.render(req.directory + '/account/register.ejs', {
        lang: res.locals.lang
    });
});

router.get('/login', async (req, res) => {
    res.render(req.directory + '/account/login.ejs', {
        lang: res.locals.lang
    });
});

// API
router.post('/register', async (req, res) => {
    const { pnid, email, password } = req.body;

    if (!pnid || !email || !password) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const user_exists = await pool.query(
            'SELECT id FROM peoples WHERE pnid = $1 OR email = $2',
            [pnid, email]
        );

        if (user_exists.rowCount > 0) {
            return res.status(403).send('User already exists');
        }

        const password_hash = await bcrypt.hash(password, 10);

        let mii_data;
        try {
            const response = await axios.get(`https://mii-unsecure.ariankordi.net/mii_data/${pnid}?api_id=1`);
            mii_data = response.data;
        } catch (error) {
            logger.error(`API Error: ${error.message}`);
            return res.status(500).send('External API Error');
        }

        const mii_url = `https://mii-unsecure.ariankordi.net/miis/image.png?nnid=${pnid}&api_id=1`;

        const insertQuery = `
            INSERT INTO peoples (pid, pnid, email, password, mii_name, mii_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        
        const new_user = await pool.query(insertQuery, [
            mii_data.pid,
            pnid, 
            email, 
            password_hash, 
            mii_data.name,
            mii_url
        ]);

        const new_user_id = new_user.rows[0].id;
        logger.info(`New user created: ${pnid} + ID: ${new_user_id})`);

        //return res.status(200).json({sucess: 1});
        return res.redirect('/account/login');
    } catch (error) {
        logger.error(`Database error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { pnid, password } = req.body;

    if (!pnid || !password) {
        return res.status(400).send('Missing PNID or password');
    }

    try {
        const user_result = await pool.query(
            'SELECT pid, pnid, password, mii_name, mii_url FROM peoples WHERE pnid = $1',
            [pnid]
        );

        if (user_result.rowCount === 0) {
            return res.status(401).send('Invalid PNID or password (1)');
        }

        const user = user_result.rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid PNID or password (2)');
        }

        req.session.user = {
            pid: user.pid,
            pnid: user.pnid,
            mii_name: user.mii_name,
            mii_url: user.mii_url
        };

        //return res.status(200).json({sucess: 1});
        return res.redirect('/titles/show');
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;