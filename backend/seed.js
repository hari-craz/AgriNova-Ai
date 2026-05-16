const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing demo data
    await User.deleteMany({ email: { $in: ['demo.farmer@agrinova.ai', 'demo.buyer@agrinova.ai'] } });
    console.log('🧹 Cleared old demo users');

    // Create demo farmer
    const farmer = await User.create({
      name: 'Rajan Patel',
      email: 'demo.farmer@agrinova.ai',
      password: 'demo123456',
      role: 'farmer',
      location: 'Gujarat',
      farmSize: 12,
      crops: ['Cotton', 'Wheat', 'Groundnut']
    });
    console.log('👨‍🌾 Created demo farmer:', farmer.email);

    // Create demo buyer
    const buyer = await User.create({
      name: 'Priya Sharma',
      email: 'demo.buyer@agrinova.ai',
      password: 'demo123456',
      role: 'buyer',
      location: 'Maharashtra'
    });
    console.log('🛒 Created demo buyer:', buyer.email);

    // Create demo products
    const products = await Product.insertMany([
      {
        name: 'Fresh Tomatoes',
        category: 'vegetables',
        description: 'Sun-grown organic tomatoes from Gujarat farms. No pesticides, hand-picked.',
        price: 1800,
        unit: 'quintal',
        quantity: 50,
        location: 'Surat, Gujarat',
        farmer: farmer._id,
        farmerName: farmer.name,
        isOrganic: true,
        status: 'available'
      },
      {
        name: 'Premium Wheat',
        category: 'grains',
        description: 'HD-2967 variety wheat, well-dried and cleaned. Ideal for flour mills.',
        price: 2350,
        unit: 'quintal',
        quantity: 200,
        location: 'Ahmedabad, Gujarat',
        farmer: farmer._id,
        farmerName: farmer.name,
        isOrganic: false,
        status: 'available'
      },
      {
        name: 'Organic Red Onions',
        category: 'vegetables',
        description: 'Premium quality red onions, dry and clean. Stored in controlled conditions.',
        price: 2200,
        unit: 'quintal',
        quantity: 80,
        location: 'Nasik, Maharashtra',
        farmer: farmer._id,
        farmerName: farmer.name,
        isOrganic: true,
        status: 'available'
      },
      {
        name: 'Alphonso Mangoes',
        category: 'fruits',
        description: 'Grade-A Alphonso mangoes from Ratnagiri. GI certified. Export quality.',
        price: 450,
        unit: 'kg',
        quantity: 500,
        location: 'Ratnagiri, Maharashtra',
        farmer: farmer._id,
        farmerName: farmer.name,
        isOrganic: false,
        status: 'available'
      },
      {
        name: 'Yellow Turmeric',
        category: 'spices',
        description: 'High curcumin content (5.2%) Erode variety turmeric. Dried and polished.',
        price: 7500,
        unit: 'quintal',
        quantity: 30,
        location: 'Erode, Tamil Nadu',
        farmer: farmer._id,
        farmerName: farmer.name,
        isOrganic: true,
        status: 'available'
      },
      {
        name: 'Basmati Rice',
        category: 'grains',
        description: '1121 variety Basmati rice. Long grain, aromatic. Perfect for export.',
        price: 5200,
        unit: 'quintal',
        quantity: 150,
        location: 'Karnal, Haryana',
        farmer: farmer._id,
        farmerName: farmer.name,
        isOrganic: false,
        status: 'available'
      }
    ]);
    console.log(`📦 Created ${products.length} demo products`);

    console.log('\n✅ Seed completed successfully!');
    console.log('📧 Demo Farmer: demo.farmer@agrinova.ai / demo123456');
    console.log('📧 Demo Buyer:  demo.buyer@agrinova.ai  / demo123456');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
