'use strict';

const mongoose = require('mongoose');

const app = require('./app');
const port = 3801;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ChatIn',
  { useMongoClient: true })
  .then(
    () => {
      // Crear nuestro servidor
      app.listen(port, () => {
        console.log('El servidor fue creado correctamente y está corriendo en http://localhost:3801');
      });
    }
  ).catch(
    (err) => { console.log(err); }
  );
