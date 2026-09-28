const SheetsDB = require('./SheetsDB');
const DriveDB = require('./DriveDB');

class DriveSheetsDB {
  /**
   * Busca o conteúdo de um arquivo JSON histórico no Drive com base em um valor procurado no Sheets.
   * @param {string} spreadsheetId - O ID da planilha de índice.
   * @param {string} sheetName - O nome da aba de índice.
   * @param {string} targetValue - O valor (ex: data do dia anterior) a ser buscado no índice.
   * @param {string} searchColumn - A chave/coluna no Sheets que contém o valor buscado (Padrão: 'day').
   * @param {string} fileIdColumn - A chave/coluna no Sheets que contém o ID do arquivo (Padrão: 'file_id').
   * @returns {Promise<Object>} - O conteúdo JSON do arquivo lido do Drive.
   */
  static async getJsonByIndex(spreadsheetId, sheetName, targetValue, searchColumn = 'day', fileIdColumn = 'file_id') {
    try {
      // 1. Cria a query para o SheetsDB buscar exatamente a linha que precisamos
      const query = { [searchColumn]: targetValue };

      // 2. Chama o método estático getRows do seu SheetsDB passando a query
      const results = await SheetsDB.getRows(spreadsheetId, sheetName, query);

      if (!results || results.length === 0) {
        throw new Error(`Nenhum registro encontrado no índice onde '${searchColumn}' = '${targetValue}'.`);
      }

      // 3. Pega o primeiro resultado encontrado
      const fileMetadata = results[0]; 
      const fileId = fileMetadata[fileIdColumn];

      if (!fileId) {
        throw new Error(`Registro encontrado, mas a coluna de ID ('${fileIdColumn}') está vazia ou não existe na planilha.`);
      }

      // 4. Utiliza o DriveDB modularmente para puxar o conteúdo
      return await DriveDB.getJsonFile(fileId);
      
    } catch (error) {
      console.error(`[DriveSheetsDB] Falha na operação híbrida:`, error.message);
      throw error;
    }
  }
}

module.exports = DriveSheetsDB;