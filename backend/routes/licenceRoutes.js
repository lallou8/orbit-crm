const express = require('express');
const router = express.Router();
const Licence = require('../models/Licence');
const auth = require('../middleware/auth');

// ============================================
// GET toutes les licences
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    let licences;
    
    if (req.user.role === 'admin') {
      licences = await Licence.find().populate('clientId');
    } else {
      licences = await Licence.find({ clientId: req.user.clientId }).populate('clientId');
    }
    
    res.json(licences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET une licence par ID
// ============================================
router.get('/:id', auth, async (req, res) => {
  try {
    const licence = await Licence.findById(req.params.id).populate('clientId');
    if (!licence) {
      return res.status(404).json({ message: 'Licence non trouvée' });
    }
    res.json(licence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// POST créer une licence (admin seulement)
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const licence = new Licence(req.body);
    await licence.save();
    res.status(201).json(licence);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT modifier une licence (admin seulement)
// ============================================
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const licence = await Licence.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!licence) {
      return res.status(404).json({ message: 'Licence non trouvée' });
    }

    res.json(licence);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// DELETE supprimer une licence (admin seulement)
// ============================================
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const licence = await Licence.findByIdAndDelete(req.params.id);
    if (!licence) {
      return res.status(404).json({ message: 'Licence non trouvée' });
    }

    res.json({ message: 'Licence supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;