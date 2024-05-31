// Example controller function to create a new post
const Post = require('../models/Post');
const User = require('../models/User');

  const createPost = async (req, res) => {
    const  decoded = req.userData;
    const Id = decoded.id
    try {
      uploadImage(req, res, async function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        const { title, sub_title,content} = req.body;
        const image = req.file ? req.file.path : null;
  
        const post = await Post.create({
          userId:Id,
          title,
          sub_title,
          content,
          image,
          createdAt: new Date(),
          updatedAt: new Date()
        });
  
        res.status(201).json(post);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get all first aid entries
  const getAllPost = async (req, res) => {
    try {
      const post = await Post.findAll();
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get a single first aid entry by ID
  const getPost = async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'First aid entry not found' });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a first aid entry by ID
  const updatePost = async (req, res) => {
    try {
      upload.single('image')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
  
        const { title,sub_title, content } = req.body;
        const image = req.file ? req.file.path : null;
  
        const post = await Post.findByPk(req.params.id);
        if (!post) {
          return res.status(404).json({ error: 'Post entry not found' });
        }
  
        await Post.update({
          title,
          sub_title,
          content,
          image: image || firstAid.image,
          updatedAt: new Date()
        });
  
        res.status(200).json(post);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a first aid entry by ID
  const deletePost = async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post entry not found' });
      }
  
      await post.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    createPost,
    getAllPost,
    getPost,
    updatePost,
    deletePost
  };
  