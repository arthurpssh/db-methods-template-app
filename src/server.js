// src/server.js
require('dotenv').config(); // Carrega as variáveis do arquivo .env
const app = require('./app');

// O Magic Deploy (e outros PaaS) injeta a porta na variável process.env.PORT
const PORT = process.env.PORT || 3001;

// O host '0.0.0.0' garante que o app aceite conexões externas no ambiente de hospedagem,
// diferentemente do 'localhost' (127.0.0.1) que é apenas local.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});