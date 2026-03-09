const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/auth');

// GET tous les clients
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET un client par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST créer un client
router.post('/', auth, async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT modifier un client
router.put('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE supprimer un client
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client non trouvé' });
    res.json({ message: 'Client supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;