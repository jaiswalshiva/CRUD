require('dotenv').config();

// Node Libraries 
const express = require('express');
const mongoose = require('mongoose');

// Config
const { app } = require('./config')

// Routes
const routes = require('./routes/routes');

const app = express();

app.use(express.json());

app.use('/api', routes);

app.listen(app.PORT, () => {
  console.log(`Server Started at ${app.PORT}`);
});
