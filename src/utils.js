/*
* Credits to PretendoNetwork for this utils
*/

const crypto = require('crypto');
const crc32 = require('crc/crc32');
const dotenv = require('dotenv');

dotenv.config();

function decodeParamPack(paramPack) {
	let dec = Buffer.from(paramPack, 'base64').toString('ascii');
	dec = dec.slice(1, -1).split('\\');
	const out = {};
	for (let i = 0; i < dec.length; i += 2) {
		out[dec[i].trim()] = dec[i + 1].trim();
	}
	return out;
}

function decryptToken(token) {
	if (!process.env.AES_KEY) {
		throw new Error('Service token AES key not found.');
	}

	const iv = Buffer.alloc(16);
	const key = Buffer.from(process.env.AES_KEY, 'hex');

	const expectedChecksum = token.readUint32BE();
	const encryptedBody = token.subarray(4);

	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

	const decrypted = Buffer.concat([
		decipher.update(encryptedBody),
		decipher.final()
	]);

	if (expectedChecksum !== crc32(decrypted)) {
		throw new Error('Checksum did not match, failed to decrypt token.');
	}

	return decrypted;
}

function unpackToken(token) {
	return {
		system_type: token.readUInt8(0x0),
		token_type: token.readUInt8(0x1),
		pid: token.readUInt32LE(0x2),
		expire_time: token.readBigUInt64LE(0x6),
		title_id: token.readBigUInt64LE(0xE),
		access_level: token.readInt8(0x16)
	};
}

function processServiceToken(encryptedToken) {
	try {
		const B64token = Buffer.from(encryptedToken, 'base64');
		const decryptedToken = this.decryptToken(B64token);
		const token = this.unpackToken(decryptedToken);

		// Only allow token types 1 (Wii U) and 2 (3DS)
		if (token.system_type !== 1 && token.system_type !== 2) {
			return null;
		}

		return token.pid;
	} catch (e) {
		console.error(e);
		return null;
	}
}

module.exports = {
    decodeParamPack,
    decryptToken,
    unpackToken,
    processServiceToken
};