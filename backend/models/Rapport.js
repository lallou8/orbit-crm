const mongoose = require('mongoose');

const RapportSchema = new mongoose.Schema({
  interventionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Intervention', 
    required: true 
  },
  technicien: { 
    type: String, 
    required: true 
  },
  dateIntervention: { 
    type: Date, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  actionsRealisees: { 
    type: String, 
    required: true 
  },
  materielUtilise: { 
    type: String 
  },
  // ===== CHAMPS SIGNATURE =====
  signature: { 
    type: String, 
    default: null 
  },
  dateSignature: {
    type: Date,
    default: null
  },
  signePar: {
    type: String,
    default: null
  },
  // ============================
  statut: { 
    type: String, 
    enum: ['en attente', 'validé', 'rejeté'],
    default: 'en attente'
  },
  commentaireValidation: { 
    type: String 
  },
  dateValidation: { 
    type: Date 
  },
  validatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Rapport', RapportSchema);