'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.MONGO_DB_URL;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => {
    console.log('Connected to MongoDB!');
  });