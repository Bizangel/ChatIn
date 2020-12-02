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
      chatfound.users.forEach(function (user) { user.dateTaken = undefined; }); // No proveer la timestmap de los usuarios
      return res.status(200).send({ users: chatfound.users });
    } else {
      return res.status(200).send({ message: 'No chat found' });
    }
  });
}

function takeUsernameInRoom (req, res, room, username) {
  Chatroom.find({ 'users.username': username.toLowerCase(), roomId: room.roomId }
  ).exec((err, roomResult) => {
    if (err) {
      res.status(500).send({ message: 'Internal Server Error' });
    }

    if (roomResult.length > 0) {
      /* Verificar tiempo */
      var users = roomResult[0].users;
      var user = users.find((element) => { return element.username === username.toLowerCase(); });
      var date = moment(parseInt(user.dateTaken), true);
      if (date.add(30, 'minutes').unix() > moment().unix) {
        return res.status(200).send({ message: 'Username successfully taken', token: jwt.createToken(username.toLowerCase(), room.roomId) });
      } else {
        return res.status(200).send({ message: 'That username is taken in this room' });
      }
    } else {
      const newUser = {
        username: username.toLowerCase(),
        dateTaken: moment().valueOf()
      };

      Chatroom.updateOne(
        { _id: room._id },
        { $push: { users: newUser } }
        , (err, nice) => {
          if (err) {
            return res.status(500).send({ message: 'Error Adding user to chat' });
          }

          return res.status(200).send({ message: 'Username successfully taken', token: jwt.createToken(username.toLowerCase(), room.roomId) });
        });
    }
  }
  );
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
          console.log('nice');
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
  const username = req.usernameObject.name;
  const chatroomId = req.params.id;
  const messageContent = req.body.content;

  if (!messageContent) {
    return res.status(200).send({ message: 'No message given' });
  }

  if (req.usernameObject.roomId.toString() !== chatroomId) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  Chatroom.findOne({ roomId: chatroomId }, (err, foundRoom) => {
    if (err) {
      res.status(500).send({ message: 'Internal server error' });
    }

    if (foundRoom) {
      const newMessage = {
        sender: username,
        content: messageContent,
        timestamp: moment().unix() // En segundos epoch

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

  if (req.usernameObject.roomId.toString() !== chatroomId) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  Chatroom.findOne({ roomId: chatroomId }, (err, chatfound) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (chatfound) {
      return res.status(200).send({ messages: chatfound.messages });
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
