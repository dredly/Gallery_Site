if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage });
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
app.use(methodOverride('_method'));
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
    console.log(artpiece);
    res.render('artpieces/show', { artpiece });
})

app.post('/gallery', upload.single('filename'), async (req, res) => {
    const { title, description } = req.body;
    const tags = req.body.tags.split(',');
    const artpiece = new Artpiece({ title, description, tags });
    artpiece.image = { url: req.file.path, filename: req.file.filename };
    await artpiece.save();
    res.redirect(`/gallery/${artpiece._id}`);
})

app.get('/gallery/:id/edit', async (req, res) => {
    const artpiece = await Artpiece.findById(req.params.id);
    const tagsString = artpiece.tags.join(', ');
    res.render('artpieces/edit', { artpiece, tagsString });
})

app.put('/gallery/:id', upload.any(), async (req, res) => {
    const { id } = req.params;
    const { title, filename, description } = req.body;
    const tags = req.body.tags.split(',');
    const updatedArtpiece = await Artpiece.findByIdAndUpdate(id, {
        title, filename, description, tags
    }, { new: true });
    console.log(updatedArtpiece);
    res.redirect(`/gallery/${updatedArtpiece._id}`);
})

app.delete('/gallery/:id', async (req, res) => {
    await Artpiece.findByIdAndDelete(req.params.id);
    res.redirect('/gallery');
})

app.get('/admin/multiupload', (req, res) => {
    res.render('admin/multiupload');
})

app.post('/admin', upload.array('filenames'), async (req, res) => {
    console.log(req.files);
    for (let file of req.files) {
        // TODO Could probably optimise this to save all at once instead of awaiting each one
        const artpiece = new Artpiece({
            title: file.originalname.split('.')[0],
            image: {
                url: file.path, filename: file.filename
            }
        });
        await artpiece.save();
    }
    res.send('success');
})

app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on port 3000');
})