const User = require('../models/User');
const { verify } = require('../helpers/token');
const HttpError = require('../utils/http-error');

module.exports = async function (req, res, next) {
	try {
		const tokenData = verify(req.cookies.token);

		const user = await User.findOne({ _id: tokenData.id });

		if (!user) {
			next(new HttpError(401, 'Authenticated user not found'));
			return;
		}

		req.user = user;

		next();
	} catch (error) {
		next(new HttpError(401, error.message || 'Token error'));
	}
};
