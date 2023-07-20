const express = require('express');
const sequelize = require('./config/config');
const session = require('express-session')
const exphbs = require('express-handlebars');


const app = express();

// Middleware for parsing JSON in request bodies
app.use(express.json());

// Middleware for parsing URL-encoded data in request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main', // This is the name of your main layout file (main.handlebars)
    layoutsDir: __dirname + '/views/layouts', // Directory where your layouts are located
  })
);
app.set('views', './views');
app.set('view engine', 'handlebars');

// Add express-session middleware
app.use(
  session({
    secret: 'your_secret_key_here', // Replace with a secret key to sign the session ID
    resave: false,
    saveUninitialized: true,
    // Additional options and configurations if needed...
  })
);

// Import and use your routes
const authRoutes = require('./controllers/api/authRoutes');
const postRoutes = require('./controllers/api/postRoutes');
const socialMediaRoutes = require('./controllers/api/socialMediaRoutes');
const homeRoutes = require('./controllers/homeRoutes')

app.use('/', homeRoutes) 
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

