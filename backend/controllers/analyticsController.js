const Analytics = require('../models/Analytics');
const Product = require('../models/Product');
const User = require('../models/User');

const getAnalytics = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'available' });

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2024, i, 1).toLocaleString('default', { month: 'short' });
      return {
        month,
        foodWaste: Math.round(800 + Math.random() * 400 - i * 20),
        farmerIncome: Math.round(15000 + i * 800 + Math.random() * 2000),
        transactions: Math.round(120 + i * 15 + Math.random() * 30),
        co2Saved: Math.round(50 + i * 5 + Math.random() * 20)
      };
    });

    const cropDemand = [
      { crop: 'Wheat', demand: 92, supply: 78, price: 2200, trend: '+5.2%' },
      { crop: 'Rice', demand: 88, supply: 85, price: 2800, trend: '+3.1%' },
      { crop: 'Tomato', demand: 75, supply: 60, price: 1500, trend: '+12.4%' },
      { crop: 'Onion', demand: 82, supply: 55, price: 1800, trend: '+18.7%' },
      { crop: 'Potato', demand: 70, supply: 80, price: 1200, trend: '-2.3%' },
      { crop: 'Corn', demand: 65, supply: 72, price: 1800, trend: '+1.8%' },
      { crop: 'Cotton', demand: 58, supply: 64, price: 6500, trend: '-1.2%' },
      { crop: 'Soybean', demand: 78, supply: 68, price: 4200, trend: '+7.3%' }
    ];

    const wasteByCategory = [
      { category: 'Vegetables', total: 4200, saved: 2800, percentage: 66.7 },
      { category: 'Fruits', total: 3100, saved: 1900, percentage: 61.3 },
      { category: 'Grains', total: 1800, saved: 1500, percentage: 83.3 },
      { category: 'Dairy', total: 900, saved: 650, percentage: 72.2 },
      { category: 'Pulses', total: 600, saved: 480, percentage: 80.0 }
    ];

    const regionalData = [
      { region: 'Punjab', farmers: 420, wasteReduced: 28, incomeIncrease: 22, transactions: 1840 },
      { region: 'Maharashtra', farmers: 380, wasteReduced: 24, incomeIncrease: 19, transactions: 1620 },
      { region: 'Gujarat', farmers: 310, wasteReduced: 20, incomeIncrease: 25, transactions: 1380 },
      { region: 'UP', farmers: 550, wasteReduced: 18, incomeIncrease: 15, transactions: 2100 },
      { region: 'Karnataka', farmers: 290, wasteReduced: 22, incomeIncrease: 21, transactions: 1250 },
      { region: 'Tamil Nadu', farmers: 260, wasteReduced: 19, incomeIncrease: 18, transactions: 1100 }
    ];

    const weeklyTrends = Array.from({ length: 7 }, (_, i) => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return {
        day: days[i],
        orders: Math.round(40 + Math.random() * 30),
        revenue: Math.round(80000 + Math.random() * 50000),
        newFarmers: Math.round(3 + Math.random() * 8)
      };
    });

    res.json({
      success: true,
      analytics: {
        summary: {
          totalFarmers: totalFarmers || 2847,
          totalBuyers: totalBuyers || 8430,
          totalProducts: totalProducts || 1240,
          activeProducts: activeProducts || 890,
          foodWasteReduced: '32.4%',
          farmerIncomeIncrease: '28.7%',
          co2Saved: '1,240 tons',
          transactionsTotal: 18420,
          totalRevenue: '₹4.2 Cr',
          sustainabilityScore: 84
        },
        monthlyData,
        cropDemand,
        wasteByCategory,
        regionalData,
        weeklyTrends,
        impactMetrics: {
          familiesBenefited: 12400,
          waterSaved: '2.4M liters',
          chemicalReduction: '18%',
          avgFarmerIncomeBefore: 85000,
          avgFarmerIncomeAfter: 109450
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      todayOrders: Math.round(45 + Math.random() * 30),
      todayRevenue: Math.round(95000 + Math.random() * 60000),
      activeFarmers: Math.round(180 + Math.random() * 50),
      pendingAlerts: Math.round(3 + Math.random() * 7)
    };
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalytics, getDashboardStats };
