const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, location, page = 1, limit = 12 } = req.query;
    const query = { status: 'available' };

    if (category && category !== 'all') query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('farmer', 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('farmer', 'name email location');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, unit, quantity, location, isOrganic, harvestDate, expiryDate } = req.body;

    const product = await Product.create({
      name,
      category,
      description,
      price,
      unit,
      quantity,
      location,
      farmer: req.user.id,
      farmerName: req.user.name,
      isOrganic: isOrganic || false,
      harvestDate,
      expiryDate
    });

    res.status(201).json({ success: true, message: 'Product listed successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient quantity available' });
    }

    const totalPrice = product.price * quantity;
    product.orders.push({
      buyerId: req.user.id,
      buyerName: req.user.name,
      quantity,
      totalPrice,
      status: 'pending'
    });
    product.quantity -= quantity;
    if (product.quantity === 0) product.status = 'sold';
    await product.save();

    res.json({
      success: true,
      message: 'Order placed successfully',
      order: {
        productName: product.name,
        quantity,
        totalPrice,
        farmerName: product.farmerName,
        status: 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, placeOrder, getMyProducts };
