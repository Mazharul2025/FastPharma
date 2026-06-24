const mongoose = require('mongoose');

const productModel = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    form: { type: String, required: true },
    dosage: String,
    price: { type: Number, required: true, min: 0 },
    description: String,
    imageUrl: String,
    badge: String,
    manufacturer: String,
    stock: { type: Number, default: 0 },
    prescriptionRequired: { type: Boolean, default: false },
    uses: [String],
    expiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productModel);