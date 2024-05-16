// Example controller function to create a new post
const Post = require('../models/post');
const User = require('../models/User');

module.exports.createPost = async (req, res) => {
    try {
      const  decoded = req.userData;
      const Id = decoded.id
      const { content} = req.body;
      const post = await Post.create({userId:Id,content});
     res.status(201).json({post});
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Update a post by ID
module.exports.updatePost = async (req, res) => {
  try {
    const decoded = req.userData;
    const Id = decoded.id;
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.userId !== Id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { content } = req.body;
    await post.update({ content });
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a post by ID
module.exports.deletePost = async (req, res) => {
  try {
    const decoded = req.userData;
    const Id = decoded.id;
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.userId !== Id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await post.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  
  // Example controller function to get all posts
  module.exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.findAll({include:[User]});
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Other controller functions for updating, deleting, etc.
  