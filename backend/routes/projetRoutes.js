const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet');
const auth = require('../middleware/auth');

// ============================================
// GET tous les projets
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    let projets;
    
    if (req.user.role === 'admin') {
      projets = await Projet.find().populate('clientId').populate('tickets');
    } else {
      projets = await Projet.find({ clientId: req.user.clientId })
        .populate('clientId')
        .populate('tickets');
    }
    
    res.json(projets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET un projet par ID
// ============================================
router.get('/:id', auth, async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id)
      .populate('clientId')
      .populate('tickets');
    
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    res.json(projet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// POST créer un projet (admin seulement)
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const projet = new Projet(req.body);
    await projet.save();
    res.status(201).json(projet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT modifier un projet (admin seulement)
// ============================================
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const projet = await Projet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.json(projet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT ajouter un ticket à un projet
// ============================================
router.put('/:id/add-ticket', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const projet = await Projet.findById(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    projet.tickets.push(req.body.ticketId);
    await projet.save();

    res.json(projet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// DELETE supprimer un projet (admin seulement)
// ============================================
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.json({ message: 'Projet supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;