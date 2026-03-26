import { logoutUser } from '../api';
import { clearSessionUser } from '../utils';
import { ACTION_TYPE } from './action-type';

export const logout = () => (dispatch) => {
	logoutUser();
	clearSessionUser();

	dispatch({
		type: ACTION_TYPE.LOGOUT,
	});
};
