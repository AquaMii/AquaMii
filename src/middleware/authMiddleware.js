function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/account/login');
  }
  next();
}

module.exports = { authMiddleware };