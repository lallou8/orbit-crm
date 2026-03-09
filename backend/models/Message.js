const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedTo: {
    type: String,
    enum: ['ticket', 'intervention', 'projet', 'general'],
    default: 'general'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedTo'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);