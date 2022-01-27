const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/admin/upload', (req, res) => {
    res.send('FORM TO UPLOAD IMAGE');
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})