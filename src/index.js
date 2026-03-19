const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('./logger');
const { connectDB } = require('./database');
dotenv.config();

const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.use('/css', express.static(path.join(__dirname, 'static/css')));

app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(routes);

app.listen(process.env.PORT, () => {
  connectDB();
  logger.success(`Listening on port ${process.env.PORT}`);
});