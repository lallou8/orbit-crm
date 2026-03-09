const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  nomSociete: { 
    type: String, 
    required: true 
  },
  email: String,
  telephone: String,
  adresse: String
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Client', ClientSchema);