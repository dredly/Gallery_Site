const express = require('express')
const router = express.Router()
const Artpiece = require('../models/artpiece')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const passport = require('passport')
const { adminRequired } = require('../middleware')

router.get('/', adminRequired, (req, res) => {
	res.render('admin/index')
})

router.get('/login', (req, res) => {
	res.render('admin/login')
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/admin/login' }), async (req, res) => {
	res.redirect('/admin')
})

router.get('/multiupload', adminRequired, (req, res) => {
	res.render('admin/multiupload')
})

router.post('/', adminRequired, upload.array('filenames'), async (req, res) => {
	console.log(req.files)
	for (let file of req.files) {
		// TODO Could probably optimise this to save all at once instead of awaiting each one
		const artpiece = new Artpiece({
			title: file.originalname.split('.')[0],
			image: {
				url: file.path, filename: file.filename
			}
		})
		await artpiece.save()
	}
	res.send('success')
})

router.get('/logout', (req, res) => {
	req.logout(() => {
		console.log('LOGGED OUT')
		res.redirect('/gallery')
	})
})

module.exports = router