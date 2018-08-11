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