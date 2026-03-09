const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============================================
// INSCRIPTION (REGISTER)
// ============================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, clientId } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Crypter le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = new User({
      email,
      password: hashedPassword,
      role: role || 'client',
      clientId
    });

    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// CONNEXION (LOGIN)
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        clientId: user.clientId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        clientId: user.clientId
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;