const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const SYSTEM_CONTEXT = `You are AgriBot, an expert AI agricultural assistant for AgriNova AI platform. 
You help Indian farmers with:
- Crop recommendations based on season, soil, and region
- Price predictions and market timing advice
- Storage guidance (cold storage, temperature, humidity requirements)
- Pest and disease management
- Sustainable farming practices
- Food waste reduction strategies
- Weather-based farming decisions
- Organic farming techniques
- Government schemes and subsidies for farmers
- Export opportunities and market linkages

Always be helpful, practical, and use simple language. Provide specific, actionable advice.
When discussing prices, use INR (₹) and mention per quintal/kg as appropriate.
Reference Indian agricultural seasons: Kharif (June-October), Rabi (November-April), Zaid (April-June).
Be encouraging and supportive of farmers' efforts toward sustainable agriculture.`;

const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Fallback intelligent responses when no API key
      const fallbackResponse = generateFallbackResponse(message);
      return res.json({ success: true, response: fallbackResponse, source: 'fallback' });
    }

    const contents = [];

    // Add conversation history
    if (history.length > 0) {
      history.slice(-6).forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }

    // Add current message with system context
    contents.push({
      role: 'user',
      parts: [{ text: `${history.length === 0 ? SYSTEM_CONTEXT + '\n\n' : ''}User: ${message}` }]
    });

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      },
      { timeout: 15000 }
    );

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error('No response from Gemini');
    }

    res.json({ success: true, response: aiResponse, source: 'gemini' });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    const fallbackResponse = generateFallbackResponse(req.body.message || '');
    res.json({ success: true, response: fallbackResponse, source: 'fallback' });
  }
};

const generateFallbackResponse = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes('wheat') || msg.includes('गेहूं')) {
    return `🌾 **Wheat Farming Guidance:**\n\nWheat is a Rabi crop best sown from October to December.\n\n**Key Tips:**\n• Ideal temperature: 10-15°C during growing, 21-26°C at ripening\n• Soil: Well-drained loamy soil, pH 6-7\n• Water requirement: 4-5 irrigations\n• Current MSP: ₹2,275/quintal\n\n**Storage:** Keep moisture below 12% for safe storage. Cold storage recommended if prices are low — wait for 15-20% price appreciation before selling.\n\nWould you like advice on pest management or market timing?`;
  }

  if (msg.includes('rice') || msg.includes('paddy') || msg.includes('धान')) {
    return `🌾 **Rice/Paddy Guidance:**\n\nRice is a Kharif crop, sown June-July and harvested October-November.\n\n**Market Insight:**\n• MSP 2024-25: ₹2,300/quintal\n• Best selling time: December-January when prices typically peak\n• High demand regions: Bengal, AP, Tamil Nadu markets\n\n**Storage Tips:**\n• Dry paddy to 14% moisture before storage\n• Cool, dry place prevents fungal growth\n• Paddy can be stored 6-12 months safely\n\nNeed help with variety selection or disease management?`;
  }

  if (msg.includes('price') || msg.includes('price') || msg.includes('msp') || msg.includes('rate')) {
    return `📊 **Market Price Information:**\n\nCurrent approximate MSP rates (2024-25):\n• Wheat: ₹2,275/quintal\n• Rice (Common): ₹2,300/quintal\n• Maize: ₹2,225/quintal\n• Soybean: ₹4,892/quintal\n• Cotton (Long): ₹7,521/quintal\n• Mustard: ₹5,950/quintal\n• Groundnut: ₹6,783/quintal\n\n**Price Tips:**\n• Use our AI Prediction Dashboard for crop-specific forecasts\n• Consider selling in phases (30-40-30) to average prices\n• Cold storage can help you wait for better prices\n\nWhich crop's price are you interested in?`;
  }

  if (msg.includes('storage') || msg.includes('cold') || msg.includes('store')) {
    return `❄️ **Cold Storage Guidelines:**\n\n**Optimal Storage Conditions:**\n| Crop | Temperature | Humidity | Duration |\n|------|------------|----------|----------|\n| Potato | 2-4°C | 90-95% | 6-9 months |\n| Onion | 0-2°C | 65-70% | 4-6 months |\n| Tomato | 8-12°C | 85-90% | 2-3 weeks |\n| Apple | 0-1°C | 90-95% | 4-6 months |\n| Mango | 13°C | 85-90% | 2-4 weeks |\n\n**Tips:**\n✅ Check for damaged produce before storage\n✅ Monitor temperature daily\n✅ Solar-powered cold storage saves 60% electricity\n✅ Proper storage reduces waste by up to 40%\n\nNeed specific guidance for a particular crop?`;
  }

  if (msg.includes('organic') || msg.includes('जैविक')) {
    return `🌱 **Organic Farming Guide:**\n\nOrganic farming can increase your income by 20-40% through premium pricing!\n\n**Getting Started:**\n1. **Certification**: Apply for PGS-India or NPOP certification\n2. **Transition Period**: 2-3 years from conventional to certified organic\n3. **Compost Making**: Kitchen waste + crop residue = 30 days = rich compost\n\n**Natural Pest Control:**\n• Neem oil spray (5ml/liter) for sucking pests\n• Pheromone traps for bollworm\n• Trichoderma for soil-borne diseases\n• Yellow sticky traps for whiteflies\n\n**Government Support:**\n• PKVY scheme: ₹50,000/hectare assistance\n• State organic boards provide certification support\n\nWould you like more details on organic certification or composting?`;
  }

  if (msg.includes('weather') || msg.includes('monsoon') || msg.includes('rain') || msg.includes('drought')) {
    return `🌤️ **Weather & Farming Advisory:**\n\n**Monsoon Planning (June-September):**\n• Kharif crops: Rice, Maize, Cotton, Soybean, Groundnut\n• Ensure proper drainage to prevent waterlogging\n• Apply fungicide as preventive measure during humid spells\n\n**Drought Preparedness:**\n• Shift to drought-tolerant varieties (millets, pulses)\n• Micro-irrigation: Drip/Sprinkler saves 40-60% water\n• Mulching reduces soil moisture loss by 25-30%\n• Rainwater harvesting for supplemental irrigation\n\n**Climate Smart Tips:**\n✅ Use soil moisture sensors for precise irrigation\n✅ Zero-tillage conserves moisture\n✅ Green manure crops improve soil water retention\n\nCheck local IMD forecasts at imd.gov.in for your region.`;
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('नमस्ते') || msg.includes('hey')) {
    return `🌿 **Namaste! Welcome to AgriBot!**\n\nI'm your AI agricultural assistant, here to help you grow better and earn more! 🚀\n\n**I can help you with:**\n🌾 Crop recommendations & planning\n💰 Price predictions & market timing\n❄️ Cold storage & preservation\n🌱 Organic farming guidance\n🐛 Pest & disease management\n📊 Government schemes & subsidies\n🌤️ Weather-based farming decisions\n\n**Quick Questions:**\n• "What should I grow this Kharif season?"\n• "What's the best time to sell onions?"\n• "How to store potatoes in cold storage?"\n• "Which government schemes help small farmers?"\n\nWhat would you like to know today?`;
  }

  if (msg.includes('government') || msg.includes('scheme') || msg.includes('subsidy') || msg.includes('yojana')) {
    return `🏛️ **Government Schemes for Farmers:**\n\n**Financial Support:**\n• **PM-KISAN**: ₹6,000/year direct transfer to farmers\n• **Kisan Credit Card**: Low-interest crop loans up to ₹3 lakh @ 4%\n• **PMFBY**: Crop insurance at very low premium rates\n\n**Infrastructure:**\n• **PM-KUSUM**: Solar pump subsidies (90% subsidy)\n• **NHM**: Cold storage construction subsidy (35%)\n• **RKVY**: Agriculture infrastructure development\n\n**Market Linkage:**\n• **eNAM**: Online agricultural market platform\n• **FPO Promotion**: Group farming incentives\n• **One District One Product**: Local specialty promotion\n\n**How to Apply:**\n→ PM-KISAN: pmkisan.gov.in\n→ PMFBY: pmfby.gov.in\n→ KCC: Visit nearest bank branch\n\nNeed details on any specific scheme?`;
  }

  // Default response
  return `🌱 **AgriBot Assistant:**\n\nThank you for your question! I'm here to help with all your agricultural needs.\n\n**I can assist with:**\n• 🌾 Crop selection & seasonal planning\n• 💰 Price trends & optimal selling time\n• ❄️ Storage & preservation methods\n• 🌱 Organic & sustainable farming\n• 🐛 Pest & disease management\n• 📋 Government schemes & subsidies\n• 💧 Irrigation & water management\n\nCould you please be more specific about what you'd like to know? For example:\n- "Best crops for sandy soil in Rajasthan"\n- "How to increase tomato yield"\n- "Cold storage tips for mango"\n\nI'm here to help you maximize your farm's productivity and income! 🚀`;
};

const getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "What crops should I grow this Kharif season?",
      "What is the current MSP for wheat?",
      "How to reduce post-harvest losses?",
      "Best practices for cold storage of onions",
      "Which government schemes are available for small farmers?",
      "How to get organic certification?",
      "Tips for drip irrigation setup",
      "How to deal with tomato blight disease?"
    ];
    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chat, getSuggestions };
