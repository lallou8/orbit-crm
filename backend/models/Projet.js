const mongoose = require('mongoose');

const ProjetSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  dateDebut: { 
    type: Date, 
    required: true 
  },
  dateFinPrevue: { 
    type: Date 
  },
  dateFinReelle: { 
    type: Date 
  },
  statut: { 
    type: String, 
    enum: ['en cours', 'terminé', 'suspendu'],
    default: 'en cours'
  },
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Projet', ProjetSchema);