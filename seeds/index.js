const mongoose = require('mongoose');
const Artpiece = require('../models/artpiece');

mongoose.connect('mongodb://localhost:27017/gallery');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Artpiece.deleteMany({});
    for (let i = 0; i < 30; i++) {
        const artpiece = new Artpiece({
            title: `Art version ${i}`,
            filename: `img${i}.jpg`,
            description: `This is an amazing piece of art`,
            tags: ['mixed media', 'original']
        })
        await artpiece.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
