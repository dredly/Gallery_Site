require('dotenv').config()

const mongoose = require('mongoose')
const Artpiece = require('../models/artpiece')
const User = require('../models/user')

// mongoose.connect('mongodb://localhost:27017/gallery')

mongoose.connect(process.env.MONGODB_ATLAS_URI)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
	console.log('Database connected')
})

const clearDB = async () => {
	await Artpiece.deleteMany({})
}

console.log(clearDB) // So Eslint doesn't complain

const createAdmin = async () => {
	await User.deleteMany({})
	const adminUser = new User({
		displayName: 'Admin',
		username: 'admin'
	})
	const password = process.env.ADMIN_PASSWORD
	await User.register(adminUser, password)
}

// clearDB().then(() => {
//     mongoose.connection.close();
// });

createAdmin().then(() => {
	mongoose.connection.close()
})