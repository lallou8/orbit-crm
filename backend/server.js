const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

// ROUTES - AJOUTE EXACTEMENT ÇA
app.use('/api/auth', require('./routes/auth'));  // <-- À METTRE ICI
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/interventions', require('./routes/interventionRoutes'));
app.use('/api/licences', require('./routes/licenceRoutes'));
app.use('/api/factures', require('./routes/factureRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/projets', require('./routes/projetRoutes'));
app.use('/api/rapports', require('./routes/rapportRoutes'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.log('❌ Erreur MongoDB:', err));

app.get('/', (req, res) => {
  res.send('🚀 API ORBIT CRM opérationnelle');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur sur port ${PORT}`));