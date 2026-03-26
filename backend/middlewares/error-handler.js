const HttpError = require('../utils/http-error');

function notFound(req, res, next) {
	next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found`));
}

function errorHandler(error, req, res, next) {
	if (res.headersSent) {
		next(error);
		return;
	}

	if (error.code === 11000) {
		res.status(409).send({ error: 'User with this login already exists' });
		return;
	}

	if (error.name === 'ValidationError') {
		const firstError = Object.values(error.errors)[0];
		res.status(400).send({ error: firstError?.message || 'Validation error' });
		return;
	}

	if (error.name === 'CastError') {
		res.status(400).send({ error: 'Invalid entity id' });
		return;
	}

	const statusCode = error.statusCode || 500;
	const message = error.message || 'Internal server error';

	res.status(statusCode).send({ error: message });
}

module.exports = {
	notFound,
	errorHandler,
};
