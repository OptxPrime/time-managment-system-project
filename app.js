const path = require('path');
const express = require('express');
const cors = require('cors');


const api = require('./routes/api');

const app = express();

app.set('view engine', 'ejs');

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());
app.use('/api/v1', api);


module.exports = app;