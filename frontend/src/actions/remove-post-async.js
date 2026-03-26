import { deletePost } from '../api';

export const removePostAsync = (id) => () =>
	deletePost(id);
