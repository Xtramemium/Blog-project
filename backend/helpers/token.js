const jwt = require('jsonwebtoken');
const HttpError = require('../utils/http-error');

const sign = process.env.JWT_KEY;

module.exports = {
	generate(data) {
		return jwt.sign(data, sign, { expiresIn: '30d' });
	},
	verify(token) {
		if (!token) {
			throw new HttpError(401, 'Invalid token');
		}

		return jwt.verify(token, sign);
	},
};
