if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const path = require('path');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const multer = require('multer');
const { cloudinary, storage } = require('./cloudinary');
const upload = multer({ storage });
const Artpiece = require('./models/artpiece');

const galleryRoutes = require('./routes/gallery')
const adminRoutes = require('./routes/admin')

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
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(passport.initialize());
app.use(passport.session()); // Make sure session is used before this

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.redirect('/gallery');
})

app.use('/gallery', galleryRoutes)

app.use('/admin', adminRoutes)

app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on port 3000');
})