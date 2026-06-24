const express = require('express');
const Product = require('../models/productModel');


const productRouter = express.Router();


// GET-All products (with pagination + search)
productRouter.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10, category, search } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {};

    if (category) query.category = category;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({ data: products, total, page, limit });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET single product
productRouter.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// CREATE product
productRouter.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();

    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// UPDATE product
productRouter.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// DELETE product
productRouter.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = productRouter;