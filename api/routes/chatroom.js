'use strict';

const express = require('express');
const ChatController = require('../controllers/chatroom');
const api = express.Router(); // Aquí estan todos los métodos con los que nosotros podemos hacer cualquier tipo de peticiones
const midAuth = require('../middlewares/auth');

api.get('/home', ChatController.home);
api.get('/getUsers/:id', ChatController.getRoomUsers);
api.get('/getMessages/:id', midAuth.validateAuth, ChatController.getMessages);

api.post('/takeUser/:id', ChatController.takeUsername);
api.post('/sendMessage/:id', midAuth.validateAuth, ChatController.sendMessage);
module.exports = api;
