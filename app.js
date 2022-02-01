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

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.redirect('/gallery');
})

app.get('/gallery', async (req, res) => {
    const artpieces = await Artpiece.find({});
    res.render('artpieces/index', { artpieces });
})

app.get('/gallery/new', (req, res) => {
    res.render('artpieces/new');
})

app.get('/gallery/:id', async (req, res) => {
    const artpiece = await Artpiece.findById(req.params.id);
    res.render('artpieces/show', { artpiece });
})

app.post('/gallery', async (req, res) => {
    const { title, filename, description } = req.body;
    const tags = req.body.tags.split(',');
    const artpiece = new Artpiece({ title, filename, description, tags });
    await artpiece.save();
    res.redirect(`/gallery/${artpiece._id}`);
})

app.delete('/gallery/:id', async (req, res) => {
    res.send("SO CALLED DELETING");
})

app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on port 3000');
})