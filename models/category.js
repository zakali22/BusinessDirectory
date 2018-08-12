const express = require('express');
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	title: {
		type: String
	},
	counter: {
		type: Number,
		default: 0
	}
});

const Category = module.exports = mongoose.model('Category', categorySchema);

// Add a business
module.exports.findCategories = (callback) => {
	Category.find(callback);
}

// Find by ID
module.exports.findACategory = (id, callback) => {
	Category.findOne(id, callback);
}

module.exports.updateCategory = (category, update, callback) => {
	Category.findOneAndUpdate(category, update, callback);
}