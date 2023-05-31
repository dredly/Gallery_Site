const express = require('express')
const router = express.Router()
const Artpiece = require('../models/artpiece')
const Exhibition = require('../models/exhibition')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const passport = require('passport')
const { adminRequired } = require('../middleware')

const dateFmtOptions = {
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
}

router.get('/', adminRequired, (req, res) => {
	res.render('admin/index')
})

router.get('/login', (req, res) => {
	res.render('admin/login')
})

router.post('/login', passport.authenticate('local', {
	failureFlash: true,
	failureRedirect: '/admin/login'
}), async (req, res) => {
	req.flash('success', 'Login Successful')
	res.redirect('/admin')
})

router.get('/multiupload', adminRequired, (req, res) => {
	res.render('admin/multiupload')
})

router.get('/exhibitions', adminRequired, (req, res) => {
	res.render('admin/exhibitions')
})

router.post('/exhibitions/delete', adminRequired, async (req, res) => {
	console.log("Deleting exhibition with id", req.body.exhibitionId);
	const exhibition = await Exhibition.findById(req.body.exhibitionId);
	await exhibition.delete();
	req.flash('success', 'Successfully deleted exhibition');
	res.redirect('/exhibitions');
})

router.get('/exhibitions/delete', adminRequired, async (req, res) => {
	const allExhibitions = await Exhibition
        .find({})
        .sort({ startDate: -1 })
    const exhibitions = allExhibitions
        .map(exh => ({
            id: exh._id.toString(),
            description: exh.description,
            exhibitionType: exh.exhibitionType,
            startDate: exh.startDate.toLocaleDateString('en-US', dateFmtOptions),
            endDate: exh.endDate.toLocaleDateString('en-US', dateFmtOptions),
        }))
	res.render('admin/delete_exhibition', { exhibitions })
})

router.post('/exhibitions', adminRequired, async (req, res) => {
	const { description, exhibitionType, startDate, endDate } = req.body
	const exhibition = new Exhibition({
		description, startDate, endDate, exhibitionType
	})
	await exhibition.save();
	req.flash('success', 'Successfully added exhibition');
	res.redirect('/exhibitions');
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
	req.flash('success', `Succesfully uploaded ${req.files.length} images`)
	res.redirect('/gallery')
})

router.get('/logout', (req, res) => {
	req.logout(() => {
		req.flash('success', 'Logged out, see you next time!')
		res.redirect('/gallery')
	})
})

module.exports = router