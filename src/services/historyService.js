const DriveSheetsDB = require('../utils/DriveSheetsDB');

if (!process.env.HISTORY_SPREADSHEET_ID) throw new Error('HISTORY_SPREADSHEET_ID environment variable is required');
const HISTORY_SPREADSHEET_ID = process.env.HISTORY_SPREADSHEET_ID;
const SHEET_NAME = process.env.HISTORY_SHEET_NAME || 'JSON Index';

class HistoryService {
  /**
   * Busca o histórico do dia especificado.
   * @param {string} dateStr - Data no formato YYYY-MM-DD (ex: 2026-09-24)
   */
  static async getDailyHistory(dateStr) {
    try {
      // Passamos 'day' como a coluna de busca e 'file_id' como a coluna de ID
      const jsonData = await DriveSheetsDB.getJsonByIndex(
        HISTORY_SPREADSHEET_ID,
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