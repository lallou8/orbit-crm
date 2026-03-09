const express = require('express');
const router = express.Router();
const Facture = require('../models/Facture');
const auth = require('../middleware/auth');

// ============================================
// GET toutes les factures
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    let factures;
    
    if (req.user.role === 'admin') {
      factures = await Facture.find().populate('clientId');
    } else {
      factures = await Facture.find({ clientId: req.user.clientId }).populate('clientId');
    }
    
    res.json(factures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET une facture par ID
// ============================================
router.get('/:id', auth, async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id).populate('clientId');
    if (!facture) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }
    res.json(facture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// POST créer une facture (admin seulement)
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const facture = new Facture(req.body);
    await facture.save();
    res.status(201).json(facture);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT modifier une facture (admin seulement)
// ============================================
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const facture = await Facture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!facture) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    res.json(facture);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// DELETE supprimer une facture (admin seulement)
// ============================================
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const facture = await Facture.findByIdAndDelete(req.params.id);
    if (!facture) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    res.json({ message: 'Facture supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;