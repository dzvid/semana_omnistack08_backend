const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    console.log(req.io, req.connectedUsers);
    const { devId } = req.params;
    const { user } = req.headers;

    // Vejo se o usuario existe que está enviando o like na base de dados
    const loggedDev = await Dev.findById(user);
    // Procuro o usuario que vai receber o like
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      // se usuário alvo não existir
      return res.status(400).json({ error: 'Liked dev does not exists!' });
    }

    // Verifico se o loggedDev ja existi na lista de likes do target
    if (targetDev.likes.includes(loggedDev._id)) {
      // Busca a informação de socket ativo entre os usuarios
      const loggedSocket = req.connectedUsers[user];
      const targetSocket = req.connectedUsers[devId];

      // Se os usuarios estiverem conectados, aviso sobre ocorrencia de match
      if(loggedSocket) {
        req.io.to(loggedSocket).emit('match', targetDev);
      }
      
      if (targetSocket) {
        req.io.to(targetSocket).emit('match', loggedDev);
      }
    }

    // se o desenvolvedor existir
    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  },
};
