const express = require('express');
const dotenv = require('dotenv');
const logger = require('./logger');
const { connectDB } = require('./database');
dotenv.config();

const app = express();

app.listen(process.env.PORT, () => {
  connectDB();
  logger.success(`Listening on port ${process.env.PORT}`);
});
