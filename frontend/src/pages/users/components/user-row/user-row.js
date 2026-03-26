import { useState } from 'react';
import PropTypes from 'prop-types';
import { updateUserRole } from '../../../../api';
import { Icon } from '../../../../components';
import { TableRow } from '../table-row/table-row';
import { PROP_TYPE } from '../../../../constants';
import styled from 'styled-components';

const UserRowContainer = ({
	className,
	id,
	login,
	registeredAt,
	roleId: userRoleId,
	roles,
	onUserRemove,
}) => {
	const [initialRoleId, setInitialRoleId] = useState(userRoleId);
	const [selectedRoleId, setSelectedRoleId] = useState(userRoleId);
	const [saveError, setSaveError] = useState('');

	const onRoleChange = ({ target }) => {
		setSelectedRoleId(Number(target.value));
		setSaveError('');
	};

	const onRoleSave = (userId, newUserRoleId) => {
		updateUserRole(userId, newUserRoleId).then(({ error }) => {
			if (error) {
				setSaveError(error);
				return;
			}

			setSaveError('');
			setInitialRoleId(newUserRoleId);
		});
	};

	const isSaveButtonDisabled = selectedRoleId === initialRoleId;

	return (
		<div className={className}>
			<TableRow border={true}>
				<div className="login-column">{login}</div>
				<div className="registered-at-column">{registeredAt}</div>
				<div className="role-column">
					<select value={selectedRoleId} onChange={onRoleChange}>
						{roles.map(({ id: roleId, name: roleName }) => (
							<option key={roleId} value={roleId}>
								{roleName}
							</option>
						))}
					</select>
					<Icon
						id="fa-floppy-o"
						margin="0 0 0 10px"
						disabled={isSaveButtonDisabled}
						onClick={() => onRoleSave(id, selectedRoleId)}
					/>
				</div>
			</TableRow>
			{saveError && <div className="save-error">{saveError}</div>}
			<Icon id="fa-trash-o" margin="0 0 0 10px" onClick={onUserRemove} />
		</div>
	);
};

export const UserRow = styled(UserRowContainer)`
	display: flex;
	margin-top: 10px;

	& select {
		padding: 0 5px;
		font-size: 16px;
	}

	& .save-error {
		margin: 8px 0 0;
		color: #c00;
	}
`;

UserRow.propTypes = {
	id: PropTypes.string.isRequired,
	login: PropTypes.string.isRequired,
	registeredAt: PropTypes.string.isRequired,
	roleId: PROP_TYPE.ROLE_ID.isRequired,
	roles: PropTypes.arrayOf(PROP_TYPE.ROLE).isRequired,
	onUserRemove: PropTypes.func.isRequired,
};
