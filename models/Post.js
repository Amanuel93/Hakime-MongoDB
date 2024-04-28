// models/post.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
const User = require('../models/User');


const Post = sequelize.define('Post', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true // Depending on your requirement, it can be allowNull: false if image is mandatory
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User, // This is the model that the foreign key references
      key: 'id' // This is the field in the referenced model
    }
  }
});

Post.belongsTo(User);
User.hasMany(Post, { foreignKey: 'userId' });


module.exports = Post;
