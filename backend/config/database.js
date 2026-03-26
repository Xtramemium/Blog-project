const mongoose = require('mongoose');

function connectDatabase() {
	return mongoose.connect(process.env.DB_CONNECTION);
}

module.exports = {
	connectDatabase,
};
