const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  // lista todos desenvolvedores que não é o usuário atual, que não são usuários que já receberam
  // like do usuário logado e não são usuários que já receberam dislike do usuário logado
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ]
    });

    // retorna os usuários novos (que podem receber like)
    return res.json(users);
  },

  // Armazena um novo usuário na base de dados
  async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });

    // Verifico se o usuário já existe na base de dados
    if (userExists) {
      return res.json(userExists);
    }
    // senão, insiro novo usuário na base de dados
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(dev);
  }
};
