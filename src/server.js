const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");

// criamos o servidor
const app = express();
const server = require("http").Server(app);
// configuro o servidor http para também aceitar requisições websocket
const io = require("socket.io")(server);

// Salva a associação de usuarios e id socket para enviar informação de match
// na forma.: 'user._id':'idsocket'
// (Não é a solução mais adequada por não ser stateless)
const connectedUsers = {};

// servidor ouvindo as conexões via websocket
io.on("connection", socket => {
  // Obtem o id do usuario que conectou
  const { user } = socket.handshake.query;

  // Associo o usuario ao seu socket e adiciono ao connectedusers
  connectedUsers[user] = socket.id;
});

mongoose.connect(
  "mongodb+srv://omnistack:omnistack08@db-omnistack08-wbvbb.mongodb.net/omnistack08?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

// Middleware para interceptar a erquisição e passar a informação de usuários conectados para o controller
// Repasso o websocket e a lista de usuarios conectados
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
