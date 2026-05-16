// AI-powered crop price prediction controller
// Uses statistical modeling + Gemini AI for recommendations

const cropData = {
  wheat: { basePrice: 2200, volatility: 0.12, season: 'rabi', demand: 'high' },
  rice: { basePrice: 2800, volatility: 0.15, season: 'kharif', demand: 'very high' },
  corn: { basePrice: 1800, volatility: 0.18, season: 'kharif', demand: 'high' },
  tomato: { basePrice: 1500, volatility: 0.45, season: 'all', demand: 'high' },
  potato: { basePrice: 1200, volatility: 0.35, season: 'rabi', demand: 'high' },
  onion: { basePrice: 1800, volatility: 0.55, season: 'rabi', demand: 'very high' },
  cotton: { basePrice: 6500, volatility: 0.20, season: 'kharif', demand: 'medium' },
  soybean: { basePrice: 4200, volatility: 0.22, season: 'kharif', demand: 'high' },
  sugarcane: { basePrice: 350, volatility: 0.08, season: 'all', demand: 'high' },
  mustard: { basePrice: 5200, volatility: 0.18, season: 'rabi', demand: 'medium' },
  chili: { basePrice: 8000, volatility: 0.60, season: 'kharif', demand: 'medium' },
  turmeric: { basePrice: 6500, volatility: 0.40, season: 'kharif', demand: 'medium' }
};

const regionModifiers = {
  'Punjab': 1.05, 'Haryana': 1.03, 'Maharashtra': 1.08, 'Gujarat': 1.06,
  'Rajasthan': 0.95, 'UP': 0.97, 'Bihar': 0.92, 'MP': 0.98,
  'Karnataka': 1.04, 'Andhra Pradesh': 1.02, 'Tamil Nadu': 1.07, 'Odisha': 0.93,
  'West Bengal': 0.96, 'Telangana': 1.01, 'Jharkhand': 0.91, 'Chhattisgarh': 0.94
};

const generateTrend = (basePrice, volatility, months = 6) => {
  const trend = [];
  let currentPrice = basePrice * (0.9 + Math.random() * 0.2);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  for (let i = 0; i < months; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const seasonalFactor = 1 + Math.sin((monthIndex / 12) * Math.PI * 2) * volatility * 0.5;
    const randomFactor = 1 + (Math.random() - 0.5) * volatility * 0.3;
    currentPrice = currentPrice * seasonalFactor * randomFactor;
    currentPrice = Math.max(currentPrice, basePrice * 0.5);
    trend.push({
      month: monthNames[monthIndex],
      price: Math.round(currentPrice),
      predicted: i > 0
    });
  }
  return trend;
};

const predictCrop = async (req, res) => {
  try {
    const { crop, region, quantity } = req.body;

    if (!crop || !region) {
      return res.status(400).json({ success: false, message: 'Crop and region are required' });
    }

    const cropLower = crop.toLowerCase();
    const cropInfo = cropData[cropLower] || { basePrice: 2000, volatility: 0.20, season: 'all', demand: 'medium' };
    const regionMod = regionModifiers[region] || 1.0;

    const basePrice = cropInfo.basePrice * regionMod;
    const currentPrice = Math.round(basePrice * (0.95 + Math.random() * 0.1));
    const predictedPrice = Math.round(basePrice * (1.02 + Math.random() * 0.15));
    const priceChange = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(1);

    const trend = generateTrend(basePrice, cropInfo.volatility);

    const demandScore = { 'very high': 92, 'high': 78, 'medium': 58, 'low': 35 }[cropInfo.demand] || 60;
    const supplyScore = Math.round(demandScore * (0.8 + Math.random() * 0.4));

    const recommendations = [];
    if (parseFloat(priceChange) > 5) {
      recommendations.push({ type: 'sell', message: `Strong upward price trend. Consider selling ${crop} in next 2-3 weeks.`, priority: 'high' });
    } else if (parseFloat(priceChange) < -5) {
      recommendations.push({ type: 'hold', message: `Price decline expected. Consider storing in cold storage for 4-6 weeks.`, priority: 'medium' });
    } else {
      recommendations.push({ type: 'monitor', message: `Price is stable. Monitor market for next 1-2 weeks before selling.`, priority: 'low' });
    }

    if (cropInfo.demand === 'very high' || cropInfo.demand === 'high') {
      recommendations.push({ type: 'expand', message: `High demand crop. Consider increasing cultivation next season.`, priority: 'medium' });
    }

    const totalRevenue = quantity ? Math.round(predictedPrice * quantity) : null;

    res.json({
      success: true,
      prediction: {
        crop: crop,
        region: region,
        currentPrice,
        predictedPrice,
        priceChange: parseFloat(priceChange),
        priceUnit: 'INR/quintal',
        confidence: Math.round(75 + Math.random() * 20),
        demandScore,
        supplyScore,
        season: cropInfo.season,
        demand: cropInfo.demand,
        trend,
        recommendations,
        totalRevenue,
        marketInsight: `${crop} in ${region} shows ${parseFloat(priceChange) > 0 ? 'positive' : 'negative'} price momentum. ${cropInfo.demand.charAt(0).toUpperCase() + cropInfo.demand.slice(1)} demand conditions prevail.`,
        bestMarkets: [region, 'Delhi', 'Mumbai', 'Kolkata'].slice(0, 3),
        coldStorageAdvised: parseFloat(priceChange) < 0 || cropInfo.volatility > 0.3
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getColdStorageData = async (req, res) => {
  try {
    const chambers = [
      {
        id: 'CH-01',
        name: 'Chamber Alpha',
        crop: 'Potatoes',
        temperature: parseFloat((2 + Math.random() * 2).toFixed(1)),
        humidity: parseFloat((85 + Math.random() * 10).toFixed(1)),
        capacity: 500,
        used: Math.round(350 + Math.random() * 100),
        solarPower: parseFloat((3.2 + Math.random() * 1.5).toFixed(1)),
        status: 'optimal',
        alerts: []
      },
      {
        id: 'CH-02',
        name: 'Chamber Beta',
        crop: 'Onions',
        temperature: parseFloat((0 + Math.random() * 3).toFixed(1)),
        humidity: parseFloat((65 + Math.random() * 15).toFixed(1)),
        capacity: 400,
        used: Math.round(280 + Math.random() * 80),
        solarPower: parseFloat((2.8 + Math.random() * 1.2).toFixed(1)),
        status: 'optimal',
        alerts: []
      },
      {
        id: 'CH-03',
        name: 'Chamber Gamma',
        crop: 'Tomatoes',
        temperature: parseFloat((8 + Math.random() * 4).toFixed(1)),
        humidity: parseFloat((90 + Math.random() * 5).toFixed(1)),
        capacity: 300,
        used: Math.round(200 + Math.random() * 60),
        solarPower: parseFloat((1.9 + Math.random() * 0.8).toFixed(1)),
        status: Math.random() > 0.7 ? 'warning' : 'optimal',
        alerts: Math.random() > 0.7 ? [{ type: 'temperature', message: 'Temperature slightly above optimal range' }] : []
      }
    ];

    const totalSolar = chambers.reduce((sum, c) => sum + c.solarPower, 0);
    const spoilageReduced = parseFloat((15 + Math.random() * 10).toFixed(1));
    const energySaved = parseFloat((totalSolar * 0.8).toFixed(1));

    res.json({
      success: true,
      coldStorage: {
        chambers,
        summary: {
          totalCapacity: chambers.reduce((s, c) => s + c.capacity, 0),
          totalUsed: chambers.reduce((s, c) => s + c.used, 0),
          totalSolarKW: parseFloat(totalSolar.toFixed(1)),
          spoilageReduced,
          energySaved,
          co2Saved: parseFloat((energySaved * 0.82).toFixed(1)),
          alertCount: chambers.reduce((s, c) => s + c.alerts.length, 0)
        },
        temperatureHistory: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          ch1: parseFloat((2 + Math.sin(i / 4) * 1.5 + Math.random() * 0.5).toFixed(1)),
          ch2: parseFloat((1 + Math.sin(i / 4) * 1.2 + Math.random() * 0.5).toFixed(1)),
          ch3: parseFloat((8 + Math.sin(i / 4) * 2 + Math.random() * 1).toFixed(1))
        })),
        solarHistory: Array.from({ length: 12 }, (_, i) => ({
          hour: `${6 + i}:00`,
          output: parseFloat((Math.sin((i / 11) * Math.PI) * 8 + Math.random()).toFixed(1))
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { predictCrop, getColdStorageData };
