const express = require('express');
const router = express.Router();
const Rapport = require('../models/Rapport');
const Intervention = require('../models/Intervention');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');

// ============================================
// GET tous les rapports
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    let rapports;
    
    if (req.user.role === 'admin') {
      rapports = await Rapport.find()
        .populate('interventionId')
        .populate('validatedBy');
    } else {
      // Client voit seulement SES rapports VALIDÉS
      const interventions = await Intervention.find({ clientId: req.user.clientId });
      const interventionIds = interventions.map(i => i._id);
      rapports = await Rapport.find({ 
        interventionId: { $in: interventionIds },
        statut: 'validé'
      })
        .populate('interventionId')
        .populate('validatedBy');
    }
    
    res.json(rapports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET un rapport par ID
// ============================================
router.get('/:id', auth, async (req, res) => {
  try {
    const rapport = await Rapport.findById(req.params.id)
      .populate('interventionId')
      .populate('validatedBy');
    
    if (!rapport) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    // Vérifier les droits d'accès
    if (req.user.role === 'client') {
      const intervention = await Intervention.findById(rapport.interventionId);
      
      if (!intervention) {
        return res.status(404).json({ message: 'Intervention non trouvée' });
      }
      
      if (!intervention.clientId) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
      
      if (intervention.clientId.toString() !== req.user.clientId) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
      
      // Client ne peut voir que les rapports validés
      if (rapport.statut !== 'validé') {
        return res.status(403).json({ message: 'Rapport non disponible' });
      }
    }
    
    res.json(rapport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// POST créer un rapport (admin seulement)
// ============================================
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const rapport = new Rapport({
      interventionId: req.body.interventionId,
      technicien: req.body.technicien,
      dateIntervention: req.body.dateIntervention,
      description: req.body.description,
      actionsRealisees: req.body.actionsRealisees,
      materielUtilise: req.body.materielUtilise,
      statut: 'en attente'
    });

    await rapport.save();
    res.status(201).json(rapport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT valider/rejeter un rapport (admin seulement)
// ============================================
router.put('/:id/valider', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const rapport = await Rapport.findById(req.params.id);
    
    if (!rapport) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    rapport.statut = req.body.statut;
    rapport.commentaireValidation = req.body.commentaireValidation;
    rapport.dateValidation = Date.now();
    rapport.validatedBy = req.user.id;

    await rapport.save();
    
    if (req.body.statut === 'validé') {
      await Intervention.findByIdAndUpdate(
        rapport.interventionId,
        { 
          statut: 'réalisé',
          rapport: rapport._id,
          dateReelle: Date.now()
        }
      );
    }

    res.json(rapport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// PUT ajouter une signature (client seulement)
// ============================================
router.put('/:id/signature', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const rapport = await Rapport.findById(req.params.id)
      .populate({
        path: 'interventionId',
        populate: { path: 'ticketId' }
      });

    if (!rapport) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    if (!rapport.interventionId || !rapport.interventionId.ticketId) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    const ticket = rapport.interventionId.ticketId;
    if (ticket.clientId.toString() !== req.user.clientId) {
      return res.status(403).json({ message: 'Ce rapport ne vous appartient pas' });
    }

    if (rapport.statut !== 'validé') {
      return res.status(400).json({ message: 'Le rapport doit être validé avant signature' });
    }

    if (rapport.signature) {
      return res.status(400).json({ message: 'Rapport déjà signé' });
    }

    rapport.signature = req.body.signature;
    rapport.dateSignature = Date.now();
    rapport.signePar = req.body.signePar || req.user.email;

    await rapport.save();

    res.json({ 
      message: 'Rapport signé avec succès',
      rapport: {
        _id: rapport._id,
        signature: rapport.signature,
        dateSignature: rapport.dateSignature,
        signePar: rapport.signePar
      }
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// DELETE supprimer un rapport (admin seulement)
// ============================================
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const rapport = await Rapport.findByIdAndDelete(req.params.id);
    
    if (!rapport) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    res.json({ message: 'Rapport supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// GET générer PDF du rapport
// ============================================
router.get('/:id/pdf', auth, async (req, res) => {
  try {
    const rapport = await Rapport.findById(req.params.id)
      .populate('interventionId')
      .populate('validatedBy');

    if (!rapport) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    // Vérifier les droits d'accès
    if (req.user.role === 'client') {
      const intervention = await Intervention.findById(rapport.interventionId);
      
      if (!intervention) {
        return res.status(404).json({ message: 'Intervention non trouvée' });
      }
      
      if (!intervention.clientId) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
      
      if (intervention.clientId.toString() !== req.user.clientId) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
    }

    // Créer le PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=rapport-${rapport._id}.pdf`);
    
    doc.pipe(res);
    
    // En-tête
    doc.fontSize(20).text('FICHE D\'INTERVENTION', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date du rapport: ${new Date(rapport.createdAt).toLocaleDateString('fr-FR')}`);
    doc.moveDown();
    
    // Informations intervention
    doc.fontSize(14).text('Informations intervention', { underline: true });
    doc.fontSize(12).text(`Technicien: ${rapport.technicien}`);
    doc.text(`Date intervention: ${new Date(rapport.dateIntervention).toLocaleDateString('fr-FR')}`);
    doc.text(`Description: ${rapport.description}`);
    doc.text(`Actions réalisées: ${rapport.actionsRealisees}`);
    if (rapport.materielUtilise) doc.text(`Matériel utilisé: ${rapport.materielUtilise}`);
    doc.moveDown();
    
    // Validation
    doc.fontSize(14).text('Validation', { underline: true });
    doc.fontSize(12).text(`Statut: ${rapport.statut}`);
    if (rapport.statut === 'validé') {
      doc.text(`Validé le: ${new Date(rapport.dateValidation).toLocaleDateString('fr-FR')}`);
      if (rapport.validatedBy) doc.text(`Validé par: ${rapport.validatedBy.email}`);
      if (rapport.commentaireValidation) doc.text(`Commentaire: ${rapport.commentaireValidation}`);
    }
    doc.moveDown();
    
    // Signature
    if (rapport.signature) {
      doc.fontSize(14).text('Signature client', { underline: true });
      doc.fontSize(12).text(`Signé par: ${rapport.signePar || 'Client'}`);
      doc.text(`Date signature: ${new Date(rapport.dateSignature).toLocaleDateString('fr-FR')}`);
      doc.moveDown();
      doc.text(rapport.signature, { align: 'right' });
    }
    
    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;