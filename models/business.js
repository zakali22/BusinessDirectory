const express = require('express');
const mongoose = require('mongoose');

const businessSchema = mongoose.Schema({
	businessName: {
		type: String
	},
	ownerName: {
		type: String
	},
	category: {
		type: String
	},
	phone: {
		type: String
	},
	slogan: {
		type: String
	},
	description: {
		type: String
	},
	address: {
		street: {
			type: String
		},
		city: {
			type: String
		},
		postcode: {
			type: String
		}
	},
	average_stars: {
		type: Number
	},
	storeGeocode: {
		long: {
			type: Number
		},
		lat: {
			type: Number
		}
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

const Business = module.exports = mongoose.model('Business', businessSchema);

// Add a business
module.exports.addBusiness = (business, callback) => {
	Business.create(business, callback);
}

// Show all businesses
module.exports.findAllBusinesses = (callback) => {
	Business.find(callback).sort({"businessName": 1});
}

// Show specific business by ID
module.exports.findBusiness = (id, callback) => {
	Business.findOne(id, callback);
}

// Find by Category
module.exports.findByCategory = (category, callback) => {
	Business.find(category, callback);
}

// Update a Business
module.exports.updateBusiness = (id, update, callback) => {
	Business.update(id, update, callback);
}