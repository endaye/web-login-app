var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Register
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);	
	

	// console.log(req.getValidationResult());
	req.getValidationResult().then(function (result) {
		if (!result.isEmpty()) {
			res.render('register', {
				errors: result.array()
			});
		} else {
			console.log('PASSED');
			var newUser = new User({
				name: name,
				email: email,
				username: username,
				password: password,
			});

			User.createUser(newUser, function(err, user) {
				if (err) throw err;
				console.log(user);
			});

			req.flash('success_msg', 'You are registered and can now login');

			res.redirect('/user/login');
		}
	});
});

module.exports = router;
