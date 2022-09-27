const express = require('express')
const router = express.Router()

router.get('/about', (req, res) => {
    res.render('info/about')
})

router.get('/contact', (req, res) => {
    res.render('info/contact')
})

module.exports = router