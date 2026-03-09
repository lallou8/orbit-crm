const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');

// ============================================
// GET tous les tickets
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    let tickets;
    
    // Admin voit tous les tickets
    if (req.user.role === 'admin') {
      tickets = await Ticket.find().populate('clientId');
    } 
    // Client voit seulement ses tickets
    else {
      tickets = await Ticket.find({ clientId: req.user.clientId }).populate('clientId');
    }
    
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET un ticket par ID
// ============================================
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('clientId');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    // Vérifier les droits d'accès
    if (req.user.role !== 'admin' && ticket.clientId._id.toString() !== req.user.clientId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// POST créer un ticket
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    // Admin doit fournir un clientId
    if (req.user.role === 'admin' && !req.body.clientId) {
      return res.status(400).json({ message: 'clientId est requis' });
    }

    // Client utilise son propre clientId
    const clientId = req.user.role === 'admin' 
      ? req.body.clientId 
      : req.user.clientId;

    // Vérifier que clientId existe
    if (!clientId) {
      return res.status(400).json({ message: 'clientId est requis' });
    }

    const ticketData = {
      titre: req.body.titre,
      description: req.body.description,
      priorite: req.body.priorite || 'moyenne',
      statut: 'ouvert',
      clientId: clientId
    };

    const ticket = new Ticket(ticketData);
    await ticket.save();
    
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT modifier un ticket (admin seulement)
// ============================================
router.put('/:id', auth, async (req, res) => {
  try {
    // Seul l'admin peut modifier
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        titre: req.body.titre,
        description: req.body.description,
        statut: req.body.statut,
        priorite: req.body.priorite
      },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// DELETE supprimer un ticket (admin seulement)
// ============================================
router.delete('/:id', auth, async (req, res) => {
  try {
    // Seul l'admin peut supprimer
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    res.json({ message: 'Ticket supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;