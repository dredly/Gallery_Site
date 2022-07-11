const express = require('express')
const router = express.Router()
const Artpiece = require('../models/artpiece')
const multer = require('multer')
const { cloudinary, storage } = require('../cloudinary')
const upload = multer({ storage })
const { adminRequired } = require('../middleware')

router.get('/', async (req, res) => {
	const allArtpieces = await Artpiece.find({})
	const allTags = [...new Set(allArtpieces.map(a => a.tags).flat())]
	console.log('allTags', allTags)
	const artpieces = req.query.tag
		? allArtpieces.filter(a => a.tags.includes(req.query.tag))
		: allArtpieces
	res.render('artpieces/index', { artpieces, tags: allTags })
})

router.get('/new', adminRequired, (req, res) => {
	res.render('artpieces/new')
})

router.get('/:id', async (req, res) => {
	const artpiece = await Artpiece.findById(req.params.id)
	console.log(artpiece)
	res.render('artpieces/show', { artpiece })
})

router.post('/', adminRequired, upload.single('filename'), async (req, res) => {
	const { title, description } = req.body
	const tags = req.body.tags.split(',').map(t => t.trim())
	const artpiece = new Artpiece({ title, description, tags })
	artpiece.image = { url: req.file.path, filename: req.file.filename }
	await artpiece.save()
	res.redirect(`/gallery/${artpiece._id}`)
})

router.get('/:id/edit', adminRequired, async (req, res) => {
	const artpiece = await Artpiece.findById(req.params.id)
	const tagsString = artpiece.tags.join(', ')
	res.render('artpieces/edit', { artpiece, tagsString })
})

router.get('/:id/delete', adminRequired, async (req, res) => {
	const artpiece = await Artpiece.findById(req.params.id)
	res.render('artpieces/delete', { artpiece })
})

router.put('/:id', adminRequired, upload.any(), async (req, res) => {
	const { id } = req.params
	const { title, filename, description } = req.body
	const tags = req.body.tags.split(',').map(t => t.trim())
	const updatedArtpiece = await Artpiece.findByIdAndUpdate(id, {
		title, filename, description, tags
	}, { new: true })
	console.log(updatedArtpiece)
	res.redirect(`/gallery/${updatedArtpiece._id}`)
})

router.delete('/:id', adminRequired, async (req, res) => {
	const artpiece = await Artpiece.findById(req.params.id)
	await artpiece.delete()
	//Also delete the image from cloudinary to free up space
	await cloudinary.uploader.destroy(artpiece.image.filename)
	console.log('Destroyed')
	res.redirect('/gallery')
})

module.exports = router