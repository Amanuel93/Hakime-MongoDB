// controllers/messageController.js
// const Chat = require('../models/Chat');
// const { Op } = require('sequelize');

// const sendMessage = async (req, res) => {
//   try {
//     const { content,senderId, receiverId } = req.body;
//     const message = await Chat.create({ content, senderId, receiverId });
//     // Emit message to connected clients using Socket.IO
//     io.emit('message', message);
//     res.status(201).json(message);
//   } catch (error) {
//     console.error('Error sending message:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getMessagesByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const messages = await Chat.findAll({
//       where: {
//         [Op.or]: [{ senderId: userId }, { receiverId: userId }]
//       }
//     });
//     res.json(messages);
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = {
//   sendMessage,
//   getMessagesByUser
// };
