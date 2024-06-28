// Example controller function to create a new post
const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
  const decoded = req.userData;
  const Id = decoded.id;
  try {
    uploadImage(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      const { title, sub_title, content } = req.body;
      const image = req.file ? req.file.path : null;

      const post = new Post({
        userId: mongoose.Types.ObjectId(Id),
        title,
        sub_title,
        content,
        image,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await post.save();
      res.status(201).json(post);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all posts
const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single post by ID
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  try {
    uploadImage.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { title, sub_title, content } = req.body;
      const image = req.file ? req.file.path : null;

      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      post.title = title;
      post.sub_title = sub_title;
      post.content = content;
      post.image = image || post.image;
      post.updatedAt = new Date();

      await post.save();
      res.status(200).json(post);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.remove();
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
  