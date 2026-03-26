import { getPost } from '../api';
import { setPostData } from './set-post-data';

export const loadPostAsync = (postId) => (dispatch) =>
	getPost(postId).then((postData) => {
		if (postData.data) {
			dispatch(setPostData(postData.data));
		}

		return postData;
	});
