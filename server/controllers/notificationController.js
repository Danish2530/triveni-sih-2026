import Notification from '../models/Notification.js';

// @desc Get notifications for logged in user
// @route GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const userRole = req.user ? req.user.role : 'all';
    const userId = req.user ? req.user._id : null;

    const notifications = await Notification.find({
      $or: [
        { recipientId: userId },
        { recipientRole: userRole },
        { recipientRole: 'all' }
      ]
    }).sort({ createdAt: -1 }).limit(20);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// @desc Mark notification as read
// @route PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification', error: error.message });
  }
};
