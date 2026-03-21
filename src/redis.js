/* 
* Credits to PretendoNetwork for this redis 
*/

const redis = require('redis');
const logger = require('./logger');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = redis.createClient({
	url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (error) => {
	logger.error(error);
});

redisClient.on('connect', () => {
	logger.success('Redis connected!');
});

async function setValue(key, value, expireTime) {
	if (!redisClient.isOpen) {
		return false;
	}

	await redisClient.set(key, value, 'EX', expireTime);
	await redisClient.expire(key, expireTime);
	return true;
}

async function getValue(key) {
	if (!redisClient.isOpen) {
		return false;
	}

	const result = await redisClient.get(key);
	return result;
}

async function removeValue(key) {
	if (!redisClient.isOpen) {
		return false;
	}

	await redisClient.del(key);
	return true;
}

module.exports = {
	redisClient,
	setValue,
	getValue,
	removeValue
};