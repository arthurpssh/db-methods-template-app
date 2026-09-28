const { getDriveClient } = require('../config/googleClient');

class DriveDB {
  /**
   * Busca e faz o parse do conteúdo de um arquivo JSON no Google Drive pelo seu ID.
   * @param {string} fileId - O ID do arquivo no Google Drive.
   * @returns {Promise<Object>} - O conteúdo do arquivo parseado em JSON.
   */
  static async getJsonFile(fileId) {
    try {
      // 1. Obtém a instância autenticada do Drive
      const drive = await getDriveClient();

      // 2. Faz a requisição de leitura do arquivo
      const response = await drive.files.get({
        fileId: fileId,
        alt: 'media', // O parâmetro 'media' diz à API para retornar o conteúdo do arquivo, e não seus metadados.
      });

      // 3. Garante o parse correto caso o axios/googleapis retorne o payload como string
      return typeof response.data === 'string' 
        ? JSON.parse(response.data) 
        : response.data; 

    } catch (error) {
      console.error(`[DriveDB] Erro ao buscar o arquivo com ID ${fileId}:`, error.message);
      throw new Error(`Falha ao ler arquivo do Drive: ${error.message}`);
    }
  }
}

module.exports = DriveDB;