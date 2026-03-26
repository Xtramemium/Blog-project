import { request } from '../utils';

export function getUsers() {
	return request('/users');
}

export function getRoles() {
	return request('/users/roles');
}

export function updateUserRole(userId, roleId) {
	return request(`/users/${userId}`, 'PATCH', { roleId });
}

export function deleteUser(userId) {
	return request(`/users/${userId}`, 'DELETE');
}
