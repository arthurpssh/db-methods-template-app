const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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

module.exports = {
  getSheetsClient
};