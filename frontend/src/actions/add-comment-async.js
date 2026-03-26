import { createComment } from '../api';
import { addComment } from './add-comment';

export const addCommentAsync = (postId, content) => (dispatch) => {
	return createComment(postId, content).then((comment) => {
		if (!comment.error && comment.data) {
			dispatch(addComment(comment.data));
		}

		return comment;
	});
};
