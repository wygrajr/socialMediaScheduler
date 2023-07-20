const { Post } = require('../models');

module.exports = {
  getAllPosts :async (req, res) => {
    try {
      // Fetch all posts from the database associated with the logged-in user
      const posts = await Post.findAll({ where: { userId: req.userId } });
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  

  createPost: async (req, res) => {
    try {
      // Extract post data from the request body
      const { title, content } = req.body;

      // Create a new post in the database
      const newPost = await Post.create({ title, content });

      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updatePost: async (req, res) => {
    try {
      // Extract post data from the request body
      const { title, content } = req.body;

      // Find the post by its ID in the database
      const postId = req.params.postId;
      const post = await Post.findByPk(postId);

      // Update the post with the new data
      if (post) {
        post.title = title;
        post.content = content;
        await post.save();

        res.status(200).json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      // Find the post by its ID in the database
      const postId = req.params.postId;
      const post = await Post.findByPk(postId);

      // Delete the post from the database
      if (post) {
        await post.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
