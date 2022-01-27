const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Artpiece = require('./models/artpiece');

mongoose.connect('mongodb://localhost:27017/gallery');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/static'));
app.use(morgan('tiny'));

app.get('/', async (req, res) => {
    const artpieces = await Artpiece.find({});
    res.render('index', { artpieces });
})

app.get('/admin/upload', (req, res) => {
    res.send('FORM TO UPLOAD IMAGE');
})

app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on port 3000');
})