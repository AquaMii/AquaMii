const { pool } = require('../database');

// yes.. I use param_pack to identify the user because the Pretendo service_token changes all the time.
async function requireAuth(req, res, next) {
  try {
    const param_pack = req.headers['x-nintendo-parampack'];

    if (!param_pack) {
      res.set('Content-Type', 'text/plain');
      return res.send('To go here, you will need to be on your 3DS or Wii U.');
    }

    if (param_pack) {
      const { rows } = await pool.query(
        'SELECT * FROM peoples WHERE param_pack = $1',
        [param_pack]
      );

      if (rows.length > 0) {
        const user = rows[0];

        if (user.banned === true) {
          return res.render(req.directory + '/banned.ejs', {
            user
          });
        }

        req.user = user;
        return next();
      }
    }

    const publicPaths = ['/titles/show/welcome'];
    if (publicPaths.includes(req.path) || req.method === 'POST') {
      return next();
    }

    return res.redirect('/titles/show/welcome');
  } catch (err) {
    console.error('Authentification error:', err);
    return res.status(500).send('Internal Server Error');
  }
}

module.exports = { requireAuth };