if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const path = require('path')
const ejsMate = require('ejs-mate')
const morgan = require('morgan')
const flash = require('connect-flash')
const favicon = require('serve-favicon')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const galleryRoutes = require('./routes/gallery')
const adminRoutes = require('./routes/admin')
const infoRoutes = require('./routes/info')

// const dbUrl = process.env.NODE_ENV === 'production'
// 	? process.env.MONGODB_ATLAS_URI
// 	: 'mongodb://localhost:27017/gallery'

const dbUrl = process.env.MONGODB_ATLAS_URI

mongoose.connect(dbUrl)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
	console.log('Database connected')
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// Expires in a week
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/static')))
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session()) // Make sure session is used before this

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next()
})

app.get('/', (req, res) => {
	res.redirect('/gallery')
})

app.get('/*/favicon.ico', (req, res) => {
	res.redirect('/favicon.ico')
})

app.use('/gallery', galleryRoutes)
app.use('/admin', adminRoutes)
app.use('/', infoRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})