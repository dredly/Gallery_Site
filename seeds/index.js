const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const process = require("process")
const Artpiece = require('../models/artpiece');

mongoose.connect('mongodb://localhost:27017/gallery');

const seed_img_dir = "./seeds/seed_imgs";
const img_dir = "./static/img";
const filenames = [];
fs.readdir(seed_img_dir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }
    files.forEach(file => {
        // Code adapted from static overflow answer by Mikey A. Leonetti
        // https://stackoverflow.com/questions/32511789/looping-through-files-in-a-folder-node-js
        // https://stackoverflow.com/users/3282410/mikey-a-leonetti
        const fromPath = path.join(seed_img_dir, file);
        const toPath = path.join(img_dir, file);
        fs.stat(fromPath, function (error, stat) {
            if (error) {
                console.error("Error stating file.", error);
                return;
            }

            if (stat.isFile())
                console.log("'%s' is a file.", fromPath);
            else if (stat.isDirectory())
                console.log("'%s' is a directory.", fromPath);

            fs.rename(fromPath, toPath, function (error) {
                if (error) {
                    console.error("File moving error.", error);
                } else {
                    console.log("Moved file '%s' to '%s'.", fromPath, toPath);
                }
            });
        });
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
