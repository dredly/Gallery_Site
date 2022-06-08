const express = require('express');
const router = express.Router();
const Artpiece = require('../models/artpiece');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/login', (req, res) => {
    res.render('admin/login')
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/admin/login' }), async (req, res) => {
    console.log('LOGGED IN')
    console.log(req.body)
    res.redirect('/gallery') // FOR TESTING
})

router.get('/multiupload', (req, res) => {
    res.render('admin/multiupload');
})

router.post('/', upload.array('filenames'), async (req, res) => {
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

module.exports = router;