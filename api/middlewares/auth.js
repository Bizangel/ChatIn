'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'InsanelyCustomSecretKey';

function validateAuth (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  // make sure that token is only token and no ' or ""
  const token = req.headers.authorization.replace(/['"]+/g, '');
  try {
    var payload = jwt.decode(token, secretKey);
    if (payload.exp <= moment().unix) {
      return res.status(401).send({ message: 'Token Expired' });
    }
  } catch {
    return res.status(404).send({ message: 'Invalid Token' });
  }

  req.usernameObject = payload;
  next();
}

module.exports = { validateAuth };
