require('dotenv').config({ path: 'config.env' });
const express = require('express');
const mongoose = require('mongoose');
// app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const app = express();
app.use(express.json());
const mongoString = process.env.DATABASE_URL;

app.use('/api', userRoutes);

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
