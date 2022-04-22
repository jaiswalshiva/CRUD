require('dotenv').config({ path: 'config.env' });
const express = require('express');
const mongoose = require('mongoose');
// app.use(express.json());

const routes = require('./routes/routes');
const app = express();
app.use(express.json());
const mongoString = process.env.DATABASE_URL;

app.use('/api', routes);

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('err', (err) => {
  console.log(err);
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
