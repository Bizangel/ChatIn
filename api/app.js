'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express(); // Carga el framework de express, para desarrollar backend

// Cargar rutas
const userRoutes = require('./routes/chatroom');
// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors

// rutas

app.use('/api', userRoutes);
module.exports = app;
