// src/app.js
const express = require('express');
const path = require('path');
const app = express();

// Middlewares globais
app.use(express.json()); // Para ler o body das requisições POST em JSON
app.use(express.urlencoded({ extended: true })); // Para ler form-data, se necessário

// Configuração da pasta public (Views estáticas)
app.use(express.static(path.join(__dirname, '../public')));

// Importar rotas
const userRoutes = require('./routes/userRoutes');
const viewRoutes = require('./routes/viewRoutes');
const historyRoutes = require('./routes/historyRoutes')

// Definir rotas principais
app.use('/api/users', userRoutes);
app.use('/', viewRoutes);
app.use('/api/history', historyRoutes);

module.exports = app;