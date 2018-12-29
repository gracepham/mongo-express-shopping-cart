const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true},
    desc: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    image: String
})

const Product = mongoose.model('Product', ProductSchema)
module.exports = {
    Product, ProductSchema
}