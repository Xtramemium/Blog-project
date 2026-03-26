const Comment = require('../models/Comment');
const Post = require('../models/Post');
const HttpError = require('../utils/http-error');

async function addComment(postId, comment) {
	const content = comment.content?.trim();

	if (!content) {
		throw new HttpError(400, 'Comment content is empty');
	}

	const post = await Post.findById(postId);

	if (!post) {
		throw new HttpError(404, 'Post not found');
	}

	const newComment = await Comment.create({
		...comment,
		content,
	});

	await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } });

	await newComment.populate('author');

	return newComment;
}

async function deleteComment(postId, commentId) {
	const post = await Post.findById(postId);

	if (!post) {
		throw new HttpError(404, 'Post not found');
	}

	const result = await Comment.deleteOne({ _id: commentId });

	if (!result.deletedCount) {
		throw new HttpError(404, 'Comment not found');
	}

	await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
}

module.exports = {
	addComment,
	deleteComment,
};
