const express = require('express');
const path = require('path');
const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/home/index.html'));
});

// Rota da integração
router.get('/users', (req, res) => {
  // Aqui você poderia colocar um middleware de autenticação antes do res.sendFile
  res.sendFile(path.join(__dirname, '../../public/users/users.html'));
});

module.exports = router;