const mongoose = require('mongoose');

const InterventionSchema = new mongoose.Schema({
  ticketId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ticket', 
    required: true 
  },
  technicien: { 
    type: String, 
    required: true 
  },
  datePrevue: { 
    type: Date, 
    required: true 
  },
  dateReelle: { 
    type: Date 
  },
  rapport: { 
    type: String 
  },
  statut: { 
    type: String, 
    enum: ['planifié', 'réalisé', 'annulé'],
    default: 'planifié'
  },
  // ✅ NOUVEAUX CHAMPS POUR LE CLIENT
  clientNom: { 
    type: String 
  },
  clientSignature: { 
    type: String 
  },
  clientCommentaires: { 
    type: String 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Intervention', InterventionSchema);