const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    // Adicionado o escopo do Drive (readonly garante apenas leitura. 
    // Se no futuro a API Node precisar criar/editar arquivos no drive, use apenas 'https://www.googleapis.com/auth/drive')
    'https://www.googleapis.com/auth/drive.readonly' 
  ],
});

// Criamos uma função que retorna a instância já autenticada do Sheets
async function getSheetsClient() {
  try {
    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client });
  } catch (error) {
    console.error('Erro ao inicializar o cliente do Google Sheets:', error);
    throw error;
  }
}

// Criamos uma função que retorna a instância já autenticada do Drive
async function getDriveClient() {
  try {
    const client = await auth.getClient();
    // A versão atual mais estável e recomendada para o Drive é a v3
    return google.drive({ version: 'v3', auth: client }); 
  } catch (error) {
    console.error('Erro ao inicializar o cliente do Google Drive:', error);
    throw error;
  }
}

module.exports = {
  getSheetsClient,
  getDriveClient
};