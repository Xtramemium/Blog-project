const express = require('express');
const { getUsers, getRoles, updateUser, deleteUser } = require('../controllers/user');
const mapUser = require('../helpers/mapUser');
const authenticated = require('../middlewares/authenticated');
const hasRole = require('../middlewares/hasRole');
const ROLES = require('../constants/roles');
const asyncHandler = require('../utils/async-handler');
const { sendData, sendMessage } = require('../utils/respond');

const router = express.Router();

router.use(authenticated);
router.use(hasRole([ROLES.ADMIN]));

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const users = await getUsers();

		sendData(res, users.map(mapUser));
	}),
);

router.get('/roles', (req, res) => {
	sendData(res, getRoles());
});

router.patch(
	'/:id',
	asyncHandler(async (req, res) => {
		const updatedUser = await updateUser(req.params.id, {
			role: req.body.roleId,
		});

		sendData(res, mapUser(updatedUser));
	}),
);

router.delete(
	'/:id',
	asyncHandler(async (req, res) => {
		await deleteUser(req.params.id);

		sendMessage(res);
	}),
);

module.exports = router;
