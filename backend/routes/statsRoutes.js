const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Intervention = require('../models/Intervention');
const Client = require('../models/Client');
const Licence = require('../models/Licence');
const Facture = require('../models/Facture');
const auth = require('../middleware/auth');

// ============================================
// GET toutes les statistiques (admin seulement)
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // 1. STATS TICKETS
    const totalTickets = await Ticket.countDocuments();
    const ticketsOuverts = await Ticket.countDocuments({ statut: 'ouvert' });
    const ticketsEnCours = await Ticket.countDocuments({ statut: 'en cours' });
    const ticketsFermes = await Ticket.countDocuments({ statut: 'fermé' });

    // 2. STATS INTERVENTIONS
    const totalInterventions = await Intervention.countDocuments();
    const interventionsPlanifiees = await Intervention.countDocuments({ statut: 'planifié' });
    const interventionsRealisees = await Intervention.countDocuments({ statut: 'réalisé' });
    const interventionsAnnulees = await Intervention.countDocuments({ statut: 'annulé' });

    // 3. STATS LICENCES
    const totalLicences = await Licence.countDocuments();
    const licencesActives = await Licence.countDocuments({ statut: 'active' });
    const licencesExpirees = await Licence.countDocuments({ statut: 'expirée' });
    
    // 4. STATS FACTURES
    const totalFactures = await Facture.countDocuments();
    const facturesPayees = await Facture.countDocuments({ statut: 'payée' });
    const facturesImpayees = await Facture.countDocuments({ statut: 'impayée' });
    const facturesEnAttente = await Facture.countDocuments({ statut: 'en attente' });
    
    // 5. STATS CLIENTS
    const totalClients = await Client.countDocuments();

    // 6. CHIFFRE D'AFFAIRES
    const factures = await Facture.find({ statut: 'payée' });
    const caTotal = factures.reduce((sum, f) => sum + f.montant, 0);

    res.json({
      tickets: {
        total: totalTickets,
        ouverts: ticketsOuverts,
        enCours: ticketsEnCours,
        fermes: ticketsFermes
      },
      interventions: {
        total: totalInterventions,
        planifiees: interventionsPlanifiees,
        realisees: interventionsRealisees,
        annulees: interventionsAnnulees
      },
      licences: {
        total: totalLicences,
        actives: licencesActives,
        expirees: licencesExpirees
      },
      factures: {
        total: totalFactures,
        payees: facturesPayees,
        impayees: facturesImpayees,
        enAttente: facturesEnAttente,
        caTotal: caTotal
      },
      clients: {
        total: totalClients
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;