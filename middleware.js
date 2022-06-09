module.exports.adminRequired = (req, res, next) => {
	if (!req.isAuthenticated()) {
		console.log('YOU MUST BE LOGGED IN')
		return res.redirect('/admin/login')
	}
	next()
}