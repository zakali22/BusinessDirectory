const express = require('express');
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	title: {
		type: String
	}
});

const Category = module.exports = mongoose.model('Category', categorySchema);

// Add a business
module.exports.findCategories = (callback) => {
	Category.find(callback);
}
