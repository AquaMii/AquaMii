function directoryMiddleware(req, res, next) {
    req.timestamp = Date.now();

    const subdomainMap = {
        portal: 'portal',
        n3ds: 'n3ds',
        web: 'aquamii',
    };
    req.directory = Object.keys(subdomainMap).find(sd => req.subdomains.includes(sd)) || 'portal';

    const writeMethods = new Set(['POST', 'PUT', 'DELETE']);
    req.isWrite = writeMethods.has(req.method.toUpperCase());

    next();
}

module.exports = directoryMiddleware;