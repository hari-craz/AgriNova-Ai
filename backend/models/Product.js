const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other']
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'quintal', 'ton', 'piece', 'dozen', 'liter'],
    default: 'kg'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  orders: [{
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    buyerName: String,
    quantity: Number,
    totalPrice: Number,
    status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' },
    orderedAt: { type: Date, default: Date.now }
  }],
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Product', productSchema);
