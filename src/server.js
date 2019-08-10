const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

// criamos o servidor
const server = express();

mongoose.connect(
  'mongodb+srv://omnistack:omnistack08@db-omnistack08-wbvbb.mongodb.net/omnistack08?retryWrites=true&w=majority',
  { useNewUrlParser: true },
);
server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(3333);
