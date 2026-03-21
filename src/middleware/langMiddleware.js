const path = require('path');
const fs = require('fs');

const translations = {
    fr: JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'translations', 'fr.json'), 'utf8')),
    en: JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'translations', 'en.json'), 'utf8'))
};

function langMiddleware(req, res, next) {
    const header = req.headers['accept-language'] || '';

    let lang = header.slice(0, 2).toLowerCase();

    if (!translations[lang]) {
        lang = 'en';
    }

    res.locals.lang = translations[lang];
    res.locals.local = lang;

    next();
}

module.exports = langMiddleware;