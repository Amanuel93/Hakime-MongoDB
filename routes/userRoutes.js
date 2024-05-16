const express = require('express');
const router = express.Router();
const  {checkAuth}  = require('../middleware/authMiddleware')
const {createPost,updatePost,deletePost} = require('../controllers/postController');

// Create a new post
router.post('/posts', checkAuth, createPost);

// Update a post by ID
router.put('/posts/:id', checkAuth, updatePost);

// Delete a post by ID
router.delete('/posts/:id', checkAuth, deletePost);

module.exports = router;