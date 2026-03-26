import { deleteComment } from '../api';
import { removeComment } from './remove-comment';

export const removeCommentAsync = (postId, id) => (dispatch) => {
	return deleteComment(postId, id).then((response) => {
		if (!response.error) {
			dispatch(removeComment(id));
		}

		return response;
	});
};
