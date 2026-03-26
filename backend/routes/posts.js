const express = require('express');
const {
	getPost,
	getPosts,
	addPost,
	editPost,
	deletePost,
} = require('../controllers/post');
const { addComment, deleteComment } = require('../controllers/comment');
const mapPost = require('../helpers/mapPost');
const mapComment = require('../helpers/mapComment');
const authenticated = require('../middlewares/authenticated');
const hasRole = require('../middlewares/hasRole');
const ROLES = require('../constants/roles');
const asyncHandler = require('../utils/async-handler');
const { sendData, sendMessage } = require('../utils/respond');

const router = express.Router();

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const { posts, lastPage } = await getPosts(
			req.query.search,
			req.query.limit,
			req.query.page,
		);

		sendData(res, {
			lastPage,
			posts: posts.map(mapPost),
		});
	}),
);

router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const post = await getPost(req.params.id);

		sendData(res, mapPost(post));
	}),
);

router.post(
	'/:id/comments',
	authenticated,
	asyncHandler(async (req, res) => {
		const newComment = await addComment(req.params.id, {
			content: req.body.content,
			author: req.user.id,
		});

		sendData(res, mapComment(newComment), 201);
	}),
);

router.delete(
	'/:postId/comments/:commentId',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
	asyncHandler(async (req, res) => {
		await deleteComment(req.params.postId, req.params.commentId);

		sendMessage(res);
	}),
);

router.post(
	'/',
	authenticated,
	hasRole([ROLES.ADMIN]),
	asyncHandler(async (req, res) => {
		const newPost = await addPost({
			title: req.body.title,
			content: req.body.content,
			image: req.body.imageUrl,
		});

		sendData(res, mapPost(newPost), 201);
	}),
);

router.patch(
	'/:id',
	authenticated,
	hasRole([ROLES.ADMIN]),
	asyncHandler(async (req, res) => {
		const updatedPost = await editPost(req.params.id, {
			title: req.body.title,
			content: req.body.content,
			image: req.body.imageUrl,
		});

		sendData(res, mapPost(updatedPost));
	}),
);

router.delete(
	'/:id',
	authenticated,
	hasRole([ROLES.ADMIN]),
	asyncHandler(async (req, res) => {
		await deletePost(req.params.id);

		sendMessage(res);
	}),
);

module.exports = router;
