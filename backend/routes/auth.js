const express = require('express');
const { register, login } = require('../controllers/user');
const mapUser = require('../helpers/mapUser');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

function authCookieOptions() {
	return {
		httpOnly: true,
		sameSite: 'lax',
	};
}

router.post(
	'/register',
	asyncHandler(async (req, res) => {
		const { user, token } = await register(req.body.login, req.body.password);

		res
			.status(201)
			.cookie('token', token, authCookieOptions())
			.send({ error: null, user: mapUser(user) });
	}),
);

router.post(
	'/login',
	asyncHandler(async (req, res) => {
		const { user, token } = await login(req.body.login, req.body.password);

		res
			.status(200)
			.cookie('token', token, authCookieOptions())
			.send({ error: null, user: mapUser(user) });
	}),
);

router.post('/logout', (req, res) => {
	res.cookie('token', '', {
		...authCookieOptions(),
		maxAge: 0,
	}).send({});
});

module.exports = router;
