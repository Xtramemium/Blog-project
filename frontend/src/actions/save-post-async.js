import { createPost, updatePost } from '../api';
import { setPostData } from './set-post-data';

export const savePostAsync = (id, newPostData) => (dispatch) => {
	const saveRequest = id
		? updatePost(id, newPostData)
		: createPost(newPostData);

	return saveRequest.then((updatedPost) => {
		if (!updatedPost.error && updatedPost.data) {
			dispatch(setPostData(updatedPost.data));
		}

		return updatedPost;
	});
};
