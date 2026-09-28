const DriveSheetsDB = require('../utils/DriveSheetsDB');

// Configurações do seu teste
const TEST_SSID = '12JwtYPNNYbRuM_fakcIpko2b8G1hPW9v26yCtlJnznU';
const SHEET_NAME = 'JSON Index';

class HistoryService {
  /**
   * Busca o histórico do dia especificado.
   * @param {string} dateStr - Data no formato YYYY-MM-DD (ex: 2026-09-24)
   */
  static async getDailyHistory(dateStr) {
    try {
      // Passamos 'day' como a coluna de busca e 'file_id' como a coluna de ID
      const jsonData = await DriveSheetsDB.getJsonByIndex(
        TEST_SSID,
        SHEET_NAME,
        dateStr,
        'day',
        'file_id'
      );
      return jsonData;
    } catch (error) {
      console.error(`[HistoryService] Erro ao buscar histórico para ${dateStr}:`, error.message);
      throw error;
    }
  }
}

module.exports = HistoryService;