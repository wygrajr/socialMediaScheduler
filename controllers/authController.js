const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = {
  renderLogin: (req, res) => {
    res.render('auth/login');
  },

  renderRegister: (req, res) => {
    res.render('auth/register');
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    req.session.user = user;
    res.redirect('/posts');
  },

  register: async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    req.session.user = newUser;
    res.redirect('/posts');
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
  },
};
