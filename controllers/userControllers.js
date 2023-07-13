const { User } = require('../models');

module.exports = {
  getUserById: async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  },

  updateProfile: async (req, res) => {
    const { id } = req.params;
    const { email, username } = req.body;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.email = email;
      user.username = username;

      await user.save();

      res.redirect('/users/' + id);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  },
};
