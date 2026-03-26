import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectLogoutVersion } from '../selectors';

export const useResetForm = (reset) => {
	const logoutVersion = useSelector(selectLogoutVersion);
	const previousLogoutVersionRef = useRef(logoutVersion);

	useEffect(() => {
		if (logoutVersion !== previousLogoutVersionRef.current) {
			reset();
		}

		previousLogoutVersionRef.current = logoutVersion;
	}, [logoutVersion, reset]);
};
