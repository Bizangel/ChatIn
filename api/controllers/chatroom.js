// const bcrypt = require('bcrypt-node');
const Chatroom = require('../models/chatroom');
const jwt = require('../services/jwt');
const moment = require('moment');
// const mongoosePaginate = require('mongoose-pagination');

function home (req, res) {
  res.status(200).send({
    saludo: 'nice'
  });
}

function getRoomUsers (req, res) {
  const chatroomId = req.params.id;

  Chatroom.findOne({ roomId: chatroomId }, (err, chatfound) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (chatfound) {
      return res.status(200).send({ users: chatfound.users });
    } else {
      return res.status(200).send({ message: 'No chat found' });
    }
  });
}

function takeUsernameInRoom (req, res, room, username) {
  Chatroom.findOne({ users: username.toLowerCase() }, (err, userFound) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (userFound) {
      return res.status(200).send({ message: 'That username is taken in this room' });
    } else {
      Chatroom.updateOne(
        { _id: room._id },
        { $push: { users: username.toLowerCase() } }
        , (err, nice) => {
          if (err) {
            return res.status(500).send({ message: 'Error Adding user to chat' });
          }

          return res.status(200).send({ message: 'Username successfully taken', token: jwt.createToken(username.toLowerCase()) });
        });
    }
  });
}

function takeUsername (req, res) {
  /* Attempts to temporarily take an username of the given chatroom,
  returns error if username is taken, and if successful, returns temporarily token
  to be able to send messages as the given username to chatroom */
  const chatroomId = req.params.id;
  const username = req.body.username;
  if (!username) {
    return res.status(200).send({
      message: 'No username given'
    });
  }

  var regex = /^[A-Za-z]\w{4,29}$/g;

  if (regex.test(username)) {
    Chatroom.findOne({ roomId: chatroomId }, (err, room) => {
      if (err) {
        return res.status(500).send({ message: 'Internal Server Error' });
      }

      if (!room) { // If room doesn't exist, create new one
        room = new Chatroom();
        room.roomId = chatroomId;
        room.save((err, storedroom) => {
          if (err) {
            return res.status(500).send({ message: 'Internal Error, couldn\'t save room' });
          }

          // If room was saved succesfully, then proceed to create user
          takeUsernameInRoom(req, res, storedroom, username);
        });
      } else { // If room already exists, just proceed to create it
        takeUsernameInRoom(req, res, room, username);
      }
    });
  } else {
    res.status(200).send({
      message: 'Invalid Username'
    });
  }
}

function sendMessage (req, res) {
  const username = req.usernameObject.username;
  const chatroomId = req.params.id;
  const messageContent = req.body.content;

  Chatroom.findOne({ roomId: chatroomId }, (err, foundRoom) => {
    if (err) {
      res.status(500).send({ message: 'Internal server error' });
    }

    if (foundRoom) {
      const newMessage = {
        sender: username,
        content: messageContent,
        timestamp: moment().unix()

      };

      Chatroom.updateOne(
        { _id: foundRoom._id },
        { $push: { messages: newMessage } }
        , (err, newMessage) => {
          if (err) {
            return res.status(500).send({ message: 'Error sending message' });
          }

          return res.status(200).send({ message: 'Message Sent' });
        });
    } else {
      return res.status(200).send({ message: 'No room found to send message' });
    }
  });
}

function getMessages (req, res) {
  const chatroomId = req.params.id;

  Chatroom.findOne({ roomId: chatroomId }, (err, chatfound) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (chatfound) {
      return res.status(200).send({ users: chatfound.messages });
    } else {
      return res.status(200).send({ message: 'No chat found' });
    }
  });
}

module.exports = {
  home,
  takeUsername,
  getRoomUsers,
  sendMessage,
  getMessages
};
