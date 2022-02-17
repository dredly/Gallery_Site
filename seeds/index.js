require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
console.log(cloudinary.config().cloud_name);

const mongoose = require('mongoose');
const fs = require('fs');
const Artpiece = require('../models/artpiece');

const seed_img_dir = "./seeds/seed_imgs";
const filenames = fs.readdirSync(seed_img_dir);

mongoose.connect('mongodb://localhost:27017/gallery');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Artpiece.deleteMany({});
    for (let i = 0; i < filenames.length; i++) {
        console.log(seed_img_dir + '/' + filenames[i]);
        const artpiece = new Artpiece({
            title: `Art version ${i}`,
            image: {
                url: "Placeholder",
                filename: filenames[i]
            },
            description: `This is an amazing piece of art`,
            tags: ['mixed media', 'original']
        })
        await artpiece.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
