const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// Rota da API que retornará o JSON
router.get('/', historyController.getHistoryByDate);

module.exports = router;