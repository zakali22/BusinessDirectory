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
	}
});

const Business = module.exports = mongoose.model('Business', businessSchema);

// Add a business
module.exports.addBusiness = (business, callback) => {
	Business.create(business, callback);
}

// Show all businesses
module.exports.findAllBusinesses = (callback) => {
	Business.find(callback).sort({"businessName": -1});
}
