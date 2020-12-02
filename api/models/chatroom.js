'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatroomSchema = Schema({
  roomId: Number,
  users: [{ username: String, dateTaken: String }],
  messages: [{ sender: String, content: String, timestamp: String }]
});

module.exports = mongoose.model('Chatroom', ChatroomSchema);
