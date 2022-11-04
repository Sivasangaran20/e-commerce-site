const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: true,
        unique: true,
      },
      title: {
        type: String,
        required: true,
      },
      imagePath: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
      manufacturer: {
        type: String,
      },
      available: {
        type: Boolean,
        required: true,
      },
},
{timestamps: true });

module.exports = mongoose.model('Product',ProductSchema)