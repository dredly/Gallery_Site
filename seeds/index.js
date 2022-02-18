const mongoose = require('mongoose');
const Artpiece = require('../models/artpiece');

mongoose.connect('mongodb://localhost:27017/gallery');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('Database connected');
});

const clearDB = async () => {
    await Artpiece.deleteMany({});
}

clearDB().then(() => {
    mongoose.connection.close();
});
