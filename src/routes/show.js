const express = require('express');
const { pool } = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
    res.redirect('/titles');
});

module.exports = router;