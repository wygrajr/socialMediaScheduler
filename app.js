const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes');
const config = require('./config/config');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
