const express = require('express')
const Exhibition = require('../models/exhibition')
const router = express.Router()

const dateFmtOptions = {
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
}

router.get('/about', (req, res) => {
    res.render('info/about')
})

router.get('/exhibitions', async (req, res) => {
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
    res.render('info/exhibitions', { exhibitions })
})

router.get('/contact', (req, res) => {
    res.render('info/contact')
})

module.exports = router