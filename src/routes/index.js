const express = require('express');
const subdomain = require('express-subdomain');
const dotenv = require('dotenv');
const directoryMiddleware = require('../middleware/directoryMiddleware');
const logger = require('../logger');

dotenv.config();

const router = express.Router();
const console = express.Router();

const show = require('./show');
const communities = require('./communities');
const users = require('./users');
const activity = require('./activity');
const messages = require('./messages');
const notifications = require('./notifications');

logger.info('Miiverse Middleware loaded!');

router.use(directoryMiddleware);

logger.info('Miiverse Routes loaded!');

router.use(subdomain(process.env.SBDMN_PORTAL, console));
router.use(subdomain(process.env.SBDMN_N3DS, console));

console.use('/titles/show', show);
console.use('/titles', communities);
console.use('/communities', communities);
console.use('/users', users);
console.use('/', activity);
console.use('/friend_messages', messages);
console.use('/news', notifications);
console.use('/account', require('./account'));

module.exports = router;