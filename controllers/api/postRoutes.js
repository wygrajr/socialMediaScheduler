const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');

// Route: GET /api/posts
router.get('/', postController.getAllPosts);

// Route: POST /api/posts
router.post('/', postController.createPost);

// Route: PUT /api/posts/:postId
router.put('/:postId', postController.updatePost);

// Route: DELETE /api/posts/:postId
router.delete('/:postId', postController.deletePost);

module.exports = router;
