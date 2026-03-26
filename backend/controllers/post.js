const Post = require('../models/Post');
const escapeRegExp = require('../utils/escape-regexp');
const HttpError = require('../utils/http-error');

async function addPost(post) {
	const newPost = await Post.create(post);

	await newPost.populate({
		path: 'comments',
		populate: 'author',
	});

	return newPost;
}

async function editPost(id, post) {
	const updatedPost = await Post.findByIdAndUpdate(id, post, {
		returnDocument: 'after',
		runValidators: true,
	});

	if (!updatedPost) {
		throw new HttpError(404, 'Post not found');
	}

	await updatedPost.populate({
		path: 'comments',
		populate: 'author',
	});

	return updatedPost;
}

async function deletePost(id) {
	const result = await Post.deleteOne({ _id: id });

	if (!result.deletedCount) {
		throw new HttpError(404, 'Post not found');
	}
}

async function getPosts(search = '', limit = 10, page = 1) {
	const normalizedLimit = Number(limit) > 0 ? Number(limit) : 10;
	const normalizedPage = Number(page) > 0 ? Number(page) : 1;
	const titleFilter = {
		title: { $regex: escapeRegExp(search), $options: 'i' },
	};

	const [posts, count] = await Promise.all([
		Post.find(titleFilter)
			.limit(normalizedLimit)
			.skip((normalizedPage - 1) * normalizedLimit)
			.sort({ createdAt: -1 }),
		Post.countDocuments(titleFilter),
	]);

	return {
		posts,
		lastPage: Math.max(1, Math.ceil(count / normalizedLimit)),
	};
}

async function getPost(id) {
	const post = await Post.findById(id).populate({
		path: 'comments',
		populate: 'author',
	});

	if (!post) {
		throw new HttpError(404, 'Post not found');
	}

	return post;
}

module.exports = {
	addPost,
	editPost,
	deletePost,
	getPosts,
	getPost,
};
