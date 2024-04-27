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
  