const { getSheetsClient } = require('../config/googleClient');

class SheetsDB {
  /**
   * Engine de queries (Portado do GAS evaluateMatch_)
   */
  static _evaluateMatch(row, headers, query) {
    for (let key in query) {
      const colIndex = headers.indexOf(key);
      if (colIndex === -1) throw new Error(`Coluna '${key}' não encontrada.`);
      
      const queryValue = query[key];
      const cellValue = row[colIndex];
      
      if (queryValue !== null && typeof queryValue === 'object') {
        if (queryValue['$ne'] !== undefined && cellValue == queryValue['$ne']) return false;
        if (queryValue['$gt'] !== undefined && cellValue <= queryValue['$gt']) return false;
        if (queryValue['$gte'] !== undefined && cellValue < queryValue['$gte']) return false;
        if (queryValue['$lt'] !== undefined && cellValue >= queryValue['$lt']) return false;
        if (queryValue['$lte'] !== undefined && cellValue > queryValue['$lte']) return false;
        if (queryValue['$in'] !== undefined && Array.isArray(queryValue['$in'])) {
          if (!queryValue['$in'].some(val => val == cellValue)) return false;
        }
        if (queryValue['$nin'] !== undefined && Array.isArray(queryValue['$nin'])) {
          if (queryValue['$nin'].some(val => val == cellValue)) return false;
        }
        if (queryValue['$contains'] !== undefined) {
          const searchStr = String(queryValue['$contains']).toLowerCase();
          const cellStr = String(cellValue).toLowerCase();
          if (!cellStr.includes(searchStr)) return false;
        }
      } else {
        if (cellValue != queryValue) return false;
      }
    }
    return true;
  }

  /**
   * Helper para buscar o gridId (necessário para deleções e ordenações na API v4)
   */
  static async _getSheetId(sheets, spreadsheetId, sheetName) {
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = spreadsheet.data.sheets.find(s => s.properties.title === sheetName);
    if (!sheet) throw new Error(`Aba não encontrada: ${sheetName}`);
    return sheet.properties.sheetId;
  }

  static async getRows(spreadsheetId, sheetName, queryJson = {}) {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const headers = rows[0];
    const data = rows.slice(1);
    
    // Opcional: injetar o id original se você garantir uma coluna "id"
    const results = data.filter(row => this._evaluateMatch(row, headers, queryJson));
    
    return results.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });
  }

  static async postRows(spreadsheetId, sheetName, jsonData) {
    const sheets = await getSheetsClient();
    let dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
    if (dataArray.length === 0) return;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!1:1`,
    });
    
    const headers = response.data.values[0];

    const matrix = dataArray.map(obj => {
      return headers.map(header => obj.hasOwnProperty(header) ? obj[header] : "");
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: matrix }
    });
  }

  static async patchRows(spreadsheetId, sheetName, queryJson, updateData) {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return 0;

    const headers = rows[0];
    const data = rows.slice(1);
    
    const dataToUpdate = [];

    // Prepara um array de atualizações mapeando a linha afetada exata
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (this._evaluateMatch(row, headers, queryJson)) {
        const updatedRow = [...row];
        for (let key in updateData) {
          const colIndex = headers.indexOf(key);
          if (colIndex !== -1) {
            updatedRow[colIndex] = updateData[key];
          }
        }
        
        dataToUpdate.push({
          range: `${sheetName}!A${i + 2}:Z${i + 2}`,
          values: [updatedRow]
        });
      }
    }

    if (dataToUpdate.length === 0) return 0;

    // Diferente do GAS que rodava em loop, enviamos tudo de uma vez
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: dataToUpdate
      }
    });

    return dataToUpdate.length;
  }

  static async deleteRows(spreadsheetId, sheetName, queryJson) {
    const sheets = await getSheetsClient();
    
    // Na API REST, a deleção requer o "Grid ID" da aba, não apenas o nome
    const sheetId = await this._getSheetId(sheets, spreadsheetId, sheetName);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return;

    const headers = rows[0];
    const data = rows.slice(1);
    const requests = [];

    // Iterando de trás para frente, igual à sua lógica no Apps Script
    for (let i = data.length - 1; i >= 0; i--) {
      const row = data[i];
      if (this._evaluateMatch(row, headers, queryJson)) {
        requests.push({
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: "ROWS",
              startIndex: i + 1, // API baseada em índice 0, a linha 2 da planilha é índice 1
              endIndex: i + 2
            }
          }
        });
      }
    }

    if (requests.length === 0) return;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests }
    });
  }
}

module.exports = SheetsDB;