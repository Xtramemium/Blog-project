const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generate } = require('../helpers/token');
const ROLES = require('../constants/roles');
const HttpError = require('../utils/http-error');

async function register(login, password) {
	if (!login?.trim()) {
		throw new HttpError(400, 'Login is empty');
	}

	if (!password) {
		throw new HttpError(400, 'Password is empty');
	}

	const existingUser = await User.findOne({ login: login.trim() });

	if (existingUser) {
		throw new HttpError(409, 'User with this login already exists');
	}

	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ login: login.trim(), password: passwordHash });
	const token = generate({ id: user.id });

	return { user, token };
}

async function login(login, password) {
	if (!login?.trim() || !password) {
		throw new HttpError(400, 'Login or password is empty');
	}

	const user = await User.findOne({ login: login.trim() });

	if (!user) {
		throw new HttpError(404, 'User not found');
	}

	const isPasswordMatch = await bcrypt.compare(password, user.password);

	if (!isPasswordMatch) {
		throw new HttpError(401, 'Wrong password');
	}

	const token = generate({ id: user.id });

	return { token, user };
}

function getUsers() {
	return User.find().sort({ createdAt: -1 });
}

function getRoles() {
	return [
		{ id: ROLES.ADMIN, name: 'Admin' },
		{ id: ROLES.MODERATOR, name: 'Moderator' },
		{ id: ROLES.USER, name: 'User' },
	];
}

async function deleteUser(id) {
	const result = await User.deleteOne({ _id: id });

	if (!result.deletedCount) {
		throw new HttpError(404, 'User not found');
	}
}

async function updateUser(id, userData) {
	const updatedUser = await User.findByIdAndUpdate(id, userData, {
		returnDocument: 'after',
		runValidators: true,
	});

	if (!updatedUser) {
		throw new HttpError(404, 'User not found');
	}

	return updatedUser;
}

module.exports = {
	register,
	login,
	getUsers,
	getRoles,
	deleteUser,
	updateUser,
};
