const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
})

const Category = mongoose.model('Category', CategorySchema);
module.exports = {
    Category, CategorySchema
}