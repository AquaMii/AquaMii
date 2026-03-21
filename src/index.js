const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { redisClient } = require('./redis');
const logger = require('./logger');
const { connectDB } = require('./database');

dotenv.config();

const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded({
	extended: true,
	limit: '1mb'
}));
app.use(express.static(path.join(__dirname, './static')));
app.use('/css', express.static(path.join(__dirname, 'static/css')));
app.use(cookieParser());
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.AES_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

app.use(routes);

app.listen(process.env.PORT, async () => {
  await connectDB();
  await redisClient.connect();
  logger.success(`Listening on port ${process.env.PORT}`);
});