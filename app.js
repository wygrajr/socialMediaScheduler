const express = require('express');
const sequelize = require('./config/config');

const app = express();

// Middleware for parsing JSON in request bodies
app.use(express.json());

// Middleware for parsing URL-encoded data in request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up your view engine (assuming you are using a templating engine like EJS)
app.set('views', './views');
app.set('view engine', 'ejs');

// Import and use your routes
const authRoutes = require('./controllers/api/authRoutes');
const postRoutes = require('./controllers/api/postRoutes');
const socialMediaRoutes = require('./controllers/api/socialMediaRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/social-media', socialMediaRoutes);

// Start the server
const PORT = process.env.PORT || 3000;

// Sync the database and start the server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

