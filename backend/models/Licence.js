const mongoose = require('mongoose');

const LicenceSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  nomProduit: { 
    type: String, 
    required: true 
  },
  quantite: { 
    type: Number, 
    required: true,
    min: 1
  },
  dateDebut: { 
    type: Date, 
    required: true 
  },
  dateFin: { 
    type: Date, 
    required: true 
  },
  statut: { 
    type: String, 
    enum: ['active', 'expirée', 'suspendue'],
    default: 'active'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Licence', LicenceSchema);