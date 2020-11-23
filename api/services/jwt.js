'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'InsanelyCustomSecretKey';

function createToken (username) {
  var payload = {
    name: username,
    lat: moment().unix(), // creation
    exp: moment().add(30, 'minutes').unix()
  };

  return jwt.encode(payload, secretKey);
}

module.exports = { createToken };
