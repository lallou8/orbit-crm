const mongoose = require('mongoose');

const FactureSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  numeroFacture: { 
    type: String, 
    required: true,
    unique: true
  },
  montant: { 
    type: Number, 
    required: true 
  },
  dateEmission: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateEcheance: { 
    type: Date, 
    required: true 
  },
  statut: { 
    type: String, 
    enum: ['payée', 'impayée', 'en attente'],
    default: 'en attente'
  },
  description: {
    type: String
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Facture', FactureSchema);