// models/post.js

// models/Post.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  sub_title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: Buffer, // Using Buffer type for binary data
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId, // Referencing the User model
    ref: 'User',
    required: true
  }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
