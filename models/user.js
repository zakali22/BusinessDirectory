const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	name: {
		type: String
	},
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	comments: [{
		comment_title: {
			type: String
		},
		comment_author: {
			type: String
		},
		comment_stars: {
			type: Number
		},
		comment_body: {
			type: String
		}
	}]	
});

const User = module.exports = mongoose.model('User', userSchema);

// Register User 
module.exports.registerUser = (newUser, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if(err){
				console.log(err);
			}
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.getUserByUsername = (user, callback) => {
	const userName = {username: user};
	User.findOne(userName, callback);
};

module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
};

module.exports.comparePasswords = (userPassword, hash, callback) => {
	bcrypt.compare(userPassword, hash, (err, isMatch) => {
		if(err) throw err;
		callback(null, isMatch);
	});
};

module.exports.updateUser = (user, update, callback) => {
	const userName = {username: user};
	User.update(userName, update, callback);
}