import { request } from '../utils';

export function getPosts(searchPhrase, page, limit) {
	const searchParams = new URLSearchParams({
		search: searchPhrase,
		page: String(page),
		limit: String(limit),
	});

	return request(`/posts?${searchParams.toString()}`);
}

export function getPost(postId) {
	return request(`/posts/${postId}`);
}

export function createPost(postData) {
	return request('/posts', 'POST', postData);
}

export function updatePost(postId, postData) {
	return request(`/posts/${postId}`, 'PATCH', postData);
}

export function deletePost(postId) {
	return request(`/posts/${postId}`, 'DELETE');
}

export function createComment(postId, content) {
	return request(`/posts/${postId}/comments`, 'POST', { content });
}

export function deleteComment(postId, commentId) {
	return request(`/posts/${postId}/comments/${commentId}`, 'DELETE');
}
