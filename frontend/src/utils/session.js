const USER_DATA_STORAGE_KEY = 'userData';

function normalizeUser(user) {
	if (!user) {
		return null;
	}

	return {
		...user,
		roleId: Number(user.roleId),
	};
}

export function loadSessionUser() {
	const currentUserDataJSON = sessionStorage.getItem(USER_DATA_STORAGE_KEY);

	if (!currentUserDataJSON) {
		return null;
	}

	try {
		return normalizeUser(JSON.parse(currentUserDataJSON));
	} catch (error) {
		sessionStorage.removeItem(USER_DATA_STORAGE_KEY);
		return null;
	}
}

export function saveSessionUser(user) {
	sessionStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(user));
}

export function clearSessionUser() {
	sessionStorage.removeItem(USER_DATA_STORAGE_KEY);
}
