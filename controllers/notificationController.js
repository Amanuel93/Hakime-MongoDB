// controllers/notificationController.js
// const Notification = require('../models/Notification');

// const sendNotification = async (req, res) => {
//   try {
//     const { content, senderId, receiverId } = req.body;
//     const notification = await Notification.create({ content, senderId, receiverId });
//     // Emit notification to connected clients using Socket.IO
//     io.emit('notification', notification);
//     res.status(201).json(notification);
//   } catch (error) {
//     console.error('Error sending notification:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getNotificationsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const notifications = await Notification.findAll({
//       where: { receiverId: userId }
//     });
//     res.json(notifications);
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = {
//   sendNotification,
//   getNotificationsByUser
// };
