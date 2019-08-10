const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    const { devId } = req.params;
    const { user } = req.headers;

    // Vejo se o usuario existe que está enviando o like na base de dados
    const loggedDev = await Dev.findById(user);
    // Procuro o usuario que vai receber o like
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      // se usuário alvo não existir
      return res.status(400).json({ error: 'Disliked dev does not exists!' });
    }

    // se o desenvolvedor existir
    loggedDev.dislikes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  },
};
