function sendData(res, data, statusCode = 200) {
	return res.status(statusCode).send({
		error: null,
		data,
	});
}

function sendMessage(res, statusCode = 200) {
	return res.status(statusCode).send({ error: null });
}

module.exports = {
	sendData,
	sendMessage,
};
