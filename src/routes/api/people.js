// LATER API WILL BE IN API.INNOVERSE.CLUB !!!!

const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const logger = require('../../logger');
const { pool } = require('../../database');

const router = express.Router();

router.post('/', async (req, res) => {
    const { pnid, password } = req.body;
    const param_pack = req.headers['x-nintendo-parampack'];

    if (!pnid || !password) {
        return res.status(400).json({
            success: 0,
            message: 'Missing required fields'
        });
    }

    try {
        const user_exists = await pool.query(
            'SELECT id FROM peoples WHERE pnid = $1',
            [pnid]
        );

        if (user_exists.rowCount > 0) {
            return res.status(403).json({
                success: 0,
                message: 'User already exists'
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        let mii_data;
        try {
            const response = await axios.get(`https://mii-unsecure.ariankordi.net/mii_data/${pnid}?api_id=1`);
            mii_data = response.data;
        } catch (error) {
            logger.error(`API Error: ${error.message}`);
            return res.status(500).json({
                success: 0,
                message: 'External API Error'
            });
        }

        const mii_url = `https://mii-unsecure.ariankordi.net/miis/image.png?nnid=${pnid}&api_id=1`;

        const insertQuery = `
            INSERT INTO peoples (pid, pnid, password, mii_name, mii_url, param_pack)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        
        const new_user = await pool.query(insertQuery, [
            mii_data.pid,
            pnid, 
            password_hash, 
            mii_data.name,
            mii_url,
            param_pack
        ]);

        const new_user_id = new_user.rows[0].id;
        logger.info(`New user created: ${pnid} + ID: ${new_user_id})`);

        res.cookie('param_pack', param_pack, { httpOnly: true });

        return res.json({success: 1});
    } catch (error) {
        logger.error(`Database error: ${error.message}`);
        return res.status(500).json({
            success: 0,
            message: 'Internal Server Error'
        });
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

        return res.json({success: 1});
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = router;