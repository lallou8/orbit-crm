const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// ============================================
// GET tous les messages (adapté selon le rôle)
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'client') {
      // Pour un client : messages où receiverId = clientId
      filter = { receiverId: req.user.clientId };
    } else {
      // Pour l'admin : messages où senderId ou receiverId = admin ID
      filter = {
        $or: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      };
    }

    const messages = await Message.find(filter)
      .populate('senderId', 'email role')
      .populate('receiverId', 'email role')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET nombre de messages non lus
// ============================================
router.get('/unread', auth, async (req, res) => {
  try {
    let filter = { read: false };

    if (req.user.role === 'client') {
      filter.receiverId = req.user.clientId;
    } else {
      filter.receiverId = req.user.id;
    }

    const count = await Message.countDocuments(filter);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// POST envoyer un message
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    const message = new Message({
      senderId: req.user.id,
      receiverId: req.body.receiverId,
      content: req.body.content,
      relatedTo: req.body.relatedTo || 'general',
      relatedId: req.body.relatedId
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT marquer un message comme lu
// ============================================
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // Déterminer le champ receiver selon le rôle
    const receiverField = req.user.role === 'client' ? req.user.clientId : req.user.id;
    
    if (message.receiverId.toString() !== receiverField) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    message.read = true;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT marquer tous les messages comme lus
// ============================================
router.put('/read-all', auth, async (req, res) => {
  try {
    const receiverField = req.user.role === 'client' ? req.user.clientId : req.user.id;

    await Message.updateMany(
      { receiverId: receiverField, read: false },
      { read: true }
    );

    res.json({ message: 'Tous les messages marqués comme lus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;