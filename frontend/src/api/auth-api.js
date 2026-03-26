import { request } from '../utils';

export function loginUser(credentials) {
	return request('/login', 'POST', credentials);
}

export function registerUser(credentials) {
	return request('/register', 'POST', credentials);
}

export function logoutUser() {
	return request('/logout', 'POST');
}
