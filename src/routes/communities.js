const express = require('express');
const { pool } = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM communities ORDER BY created_at DESC');
  const communities = result.rows;

  res.render(req.directory + '/communities.ejs', { communities });
});

router.get('/all', async (req, res) => {
  const result = await pool.query('SELECT * FROM communities ORDER BY created_at DESC');
  const communities = result.rows;

  res.render(req.directory + '/all_communities.ejs', { communities });
});

router.get('/:id', async (req, res) => {
  const communityId = req.params.id;
  const result = await pool.query('SELECT * FROM communities WHERE id = $1', [communityId]);

  if (result.rows.length === 0) {
    return res.status(404).send('NOPE.');
  }

  const community = result.rows[0];
  res.render(req.directory + '/page_community.ejs', { community });
});

module.exports = router;