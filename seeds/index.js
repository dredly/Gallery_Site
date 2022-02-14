const mongoose = require('mongoose');
const fs = require('fs');
const process = require("process")
const Artpiece = require('../models/artpiece');

mongoose.connect('mongodb://localhost:27017/gallery');

const img_dir = "./seeds/seed_imgs";
const filenames = [];
fs.readdir(img_dir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }
    files.forEach(file => {
        filenames.push(file);
    })
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Artpiece.deleteMany({});
    for (let i = 0; i < filenames.length; i++) {
        const artpiece = new Artpiece({
            title: `Art version ${i}`,
            filename: filenames[i],
            description: `This is an amazing piece of art`,
            tags: ['mixed media', 'original']
        })
        await artpiece.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
