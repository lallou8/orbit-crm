const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  titre: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  statut: { 
    type: String, 
    enum: ['ouvert', 'en cours', 'fermé'],
    default: 'ouvert'
  },
  priorite: { 
    type: String, 
    enum: ['basse', 'moyenne', 'haute'],
    default: 'moyenne'
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Ticket', TicketSchema);