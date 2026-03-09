const express = require('express');
const router = express.Router();
const Intervention = require('../models/Intervention');
const Ticket = require('../models/Ticket');
const Rapport = require('../models/Rapport');
const auth = require('../middleware/auth');

// ============================================
// GET toutes les interventions
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    let interventions;
    
    if (req.user.role === 'admin') {
      interventions = await Intervention.find()
        .populate({
          path: 'ticketId',
          populate: { path: 'clientId' }
        });
    } else {
      // Client voit les interventions de ses tickets
      const tickets = await Ticket.find({ clientId: req.user.clientId });
      const ticketIds = tickets.map(t => t._id);
      
      interventions = await Intervention.find({ ticketId: { $in: ticketIds } })
        .populate({
          path: 'ticketId',
          populate: { path: 'clientId' }
        });
    }
    
    res.json(interventions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET une intervention par ID
// ============================================
router.get('/:id', auth, async (req, res) => {
  try {
    const intervention = await Intervention.findById(req.params.id)
      .populate({
        path: 'ticketId',
        populate: { path: 'clientId' }
      });
    
    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }

    res.json(intervention);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// POST créer une intervention (admin seulement)
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const intervention = new Intervention({
      ticketId: req.body.ticketId,
      technicien: req.body.technicien,
      datePrevue: req.body.datePrevue,
      statut: 'planifié'
    });

    await intervention.save();
    
    // Mettre à jour le statut du ticket
    await Ticket.findByIdAndUpdate(req.body.ticketId, { statut: 'en cours' });

    res.status(201).json(intervention);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT modifier une intervention (admin seulement)
// ============================================
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const intervention = await Intervention.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }

    // ============================================
    // SI INTERVENTION RÉALISÉE → GÉNÉRATION AUTO DU RAPPORT
    // ============================================
    if (req.body.statut === 'réalisé') {
      // 1. Fermer le ticket
      await Ticket.findByIdAndUpdate(intervention.ticketId, { statut: 'fermé' });
      
      // 2. Vérifier si un rapport existe déjà
      const rapportExistant = await Rapport.findOne({ interventionId: req.params.id });
      
      // 3. Si aucun rapport, le créer automatiquement
      if (!rapportExistant) {
        const ticket = await Ticket.findById(intervention.ticketId).populate('clientId');
        
        const nouveauRapport = new Rapport({
          interventionId: intervention._id,
          technicien: intervention.technicien,
          dateIntervention: intervention.dateReelle || intervention.datePrevue || Date.now(),
          description: `Intervention pour ticket: ${ticket?.titre || 'N/A'}`,
          actionsRealisees: req.body.actionsRealisees || "Intervention réalisée",
          materielUtilise: req.body.materielUtilise || "Non spécifié",
          statut: 'en attente'
        });
        
        await nouveauRapport.save();
        console.log(`✅ Rapport créé automatiquement pour l'intervention ${intervention._id}`);
      }
    }

    res.json(intervention);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// ✅ NOUVELLE ROUTE : mise à jour des informations client
// ============================================
router.put('/:id/client', auth, async (req, res) => {
  try {
    // Seul le client connecté peut modifier ses propres infos
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const intervention = await Intervention.findById(req.params.id)
      .populate({
        path: 'ticketId',
        populate: { path: 'clientId' }
      });

    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }

    // Vérifier que l'intervention appartient bien au client connecté
    const clientId = intervention.ticketId?.clientId?._id?.toString();
    if (!clientId || clientId !== req.user.clientId) {
      return res.status(403).json({ message: 'Cette intervention ne vous appartient pas' });
    }

    // Mise à jour des champs client
    intervention.clientNom = req.body.nomClient;
    intervention.clientSignature = req.body.signatureClient;
    intervention.clientCommentaires = req.body.commentaires;

    await intervention.save();

    res.json({
      message: 'Informations client mises à jour',
      intervention
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;