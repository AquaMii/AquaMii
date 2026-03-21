function requireAuth(req, res, next) {
    const publicPaths = ['/account/login', '/account/register'];
    if (publicPaths.includes(req.path)) {
        return next();
    }

    if (!req.session.user) {
        return res.redirect('/account/login');
    }

    next();
}

module.exports = { requireAuth };