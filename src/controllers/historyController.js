const HistoryService = require('../services/historyService');

const getHistoryByDate = async (req, res) => {
  try {
    // Pega a data da query string, ou usa um fallback para o seu teste
    const targetDate = req.query.date || '2026-09-24'; 
    
    const data = await HistoryService.getDailyHistory(targetDate);
    
    res.status(200).json({
      success: true,
      date: targetDate,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getHistoryByDate
};