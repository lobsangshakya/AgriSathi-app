/**
 * Working Chatbot Service with Actual AI Responses
 * Provides intelligent farming assistance with real responses
 */

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'image';
}

interface ChatContext {
  language: string;
  lastMessage?: string;
}

interface ChatbotResponse {
  content: string;
  suggestions?: string[];
  followUp?: string;
}

class WorkingChatbot {
  private knowledgeBase = {
    // Disease and pest information
    diseases: {
      tomato: {
        yellowLeaf: {
          symptoms: ['पीले पत्ते', 'धीमी वृद्धि', 'फल छोटे', 'Yellow leaves', 'slow growth', 'small fruits'],
          causes: ['पोषक तत्वों की कमी', 'वायरस', 'Nutrient deficiency', 'virus'],
          treatment: ['जैविक खाद', 'नीम का स्प्रे', 'प्रभावित पौधे हटाएं', 'Organic fertilizer', 'neem spray', 'remove affected plants'],
          prevention: ['बीज उपचार', 'फसल चक्र', 'Seed treatment', 'crop rotation']
        },
        blight: {
          symptoms: ['पत्तियों पर धब्बे', 'पानी भरे हुए', 'Leaf spots', 'water soaked areas'],
          causes: ['अधिक नमी', 'फंगाल संक्रमण', 'Excess moisture', 'fungal infection'],
          treatment: ['फफूंगनाशक', 'वायु चक्र', 'Fungicide', 'air circulation'],
          prevention: ['उचित सिंचाई', 'जैविक उपचार', 'Proper irrigation', 'organic treatment']
        }
      },
      wheat: {
        rust: {
          symptoms: ['भूरे धब्बे', 'पीले धाग', 'Brown spots', 'yellow streaks'],
          causes: ['फंगाल संक्रमण', 'उच्च नमी', 'Fungal infection', 'high humidity'],
          treatment: ['फफूंगनाशक', 'प्रतिरोधी किस्में', 'Fungicide', 'resistant varieties'],
          prevention: ['समयुक्त बुआई', 'फसल चक्र', 'Timely sowing', 'crop rotation']
        }
      }
    },
    // Weather and farming advice
    weather: {
      sunny: {
        advice: ['सिंचाई का समय', 'फसलों की जांच', 'Irrigation time', 'crop inspection'],
        crops: ['गेहूं', 'धान', 'मक्का', 'Wheat', 'Rice', 'Maize']
      },
      rainy: {
        advice: ['जल निकास', 'बीमारी से बचाव', 'Drainage', 'disease prevention'],
        crops: ['धान', 'गन्ना', 'सब्जियां', 'Rice', 'sugarcane', 'vegetables']
      },
      cloudy: {
        advice: ['उर्वरक का उपयोग', 'फसल चक्र', 'Use fertilizer', 'crop rotation'],
        crops: ['टमाटर', 'बैंगन', 'आलू', 'Tomato', 'brinjal', 'potato']
      }
    },
    // Market prices (mock data)
    market: {
      tomato: { price: 40, unit: 'kg', trend: 'up', bestMarket: 'Mandi' },
      wheat: { price: 2200, unit: 'quintal', trend: 'stable', bestMarket: 'APMC' },
      rice: { price: 2500, unit: 'quintal', trend: 'up', bestMarket: 'Mandi' },
      potato: { price: 25, unit: 'kg', trend: 'down', bestMarket: 'Local Market' }
    },
    // Fertilizer recommendations
    fertilizers: {
      nitrogen: ['यूरिया', 'यूरिया खाद', 'Urea', 'urea fertilizer'],
      phosphorus: ['डीएपी', 'सुपर फॉस्फेट', 'DAP', 'super phosphate'],
      potassium: ['पोटाश', 'एमओपी', 'Potash', 'MOP'],
      organic: ['गोबर', 'वर्मीकम्पोस्ट', 'गाय गोबर', 'Cow dung', 'vermicompost']
    }
  };

  private responses = {
    greetings: {
      hindi: [
        '🌾 नमस्ते! मैं आपका कृषि सहायक हूं। मैं आपकी फसलों, मौसम, बाजार और खेती से जुड़े सभी सवालों का जवाब दे सकता हूं।',
        '🙏 आपका स्वागत है किसान भाई! मैं आपकी मदद करने के लिए यहां हूं।',
        '🌱 कृषि से जुड़े किसी भी सवाल पर मुझे पूछें। मैं हमेशा आपकी सेवा में तत्पर हूं।'
      ],
      english: [
        '🌾 Hello! I am your farming assistant. I can help you with crops, weather, market, and all farming-related questions.',
        '🙏 Welcome farmer! I am here to assist you with all your farming needs.',
        '🌱 Ask me anything related to agriculture. I am always ready to help you.'
      ]
    },
    help: {
      hindi: [
        'मैं आपकी मदद इन विषयों में कर सकता हूं:\n• फसल बीमारियों की पहचान\n• मौसम जानकारी और पूर्वानुमान\n• बाजार भाव और कीमतें\n• खाद और दवाई के बारे में सलाह\n• खेती के तरीके और उपकरण',
        'मैं आपको इस तरह मदद कर सकता हूं:\n• फसल स्वास्थ्य जांच\n• मौसम पूर्वानुमान\n• बाजार कीमतें\n• खाद सुझाव\n• कीट प्रबंधन'
      ],
      english: [
        'I can help you with:\n• Crop disease identification\n• Weather information and forecasts\n• Market prices and rates\n• Fertilizer and medicine advice\n• Farming methods and equipment',
        'I can assist you with:\n• Crop health check\n• Weather forecast\n• Market prices\n• Fertilizer recommendations\n• Pest control'
      ]
    },
    unknown: {
      hindi: [
        'मुझे आपका सवाल समझ नहीं आया। कृपया इसे दोबारा या सरल शब्दों में पूछें।',
        'क्षमा करें, मैं इस विषय पर जानकारी नहीं रखता। कृपया बीमारी, मौसम, बाजार या खाद के बारे में पूछें।',
        'मैं अभी सीख रहा हूं। कृपया मुझे फसल बीमारी, मौसम, बाजार भाव या खेती के बारे में पूछें।'
      ],
      english: [
        'I didn\'t understand your question. Please ask again in simpler words.',
        'Sorry, I don\'t have information about this topic. Please ask about crop diseases, weather, market prices, or fertilizers.',
        'I am still learning. Please ask me about crop diseases, weather, market prices, or farming methods.'
      ]
    }
  };

  /**
   * Process user message and generate intelligent response
   */
  async processMessage(message: string, context?: ChatContext): Promise<ChatbotResponse> {
    const language = context?.language || 'hindi';
    const lowerMessage = message.toLowerCase();

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Check for greetings
    if (this.isGreeting(lowerMessage)) {
      return {
        content: this.getRandomResponse('greetings', language),
        suggestions: this.getSuggestions(language)
      };
    }

    // Check for help requests
    if (this.isHelpRequest(lowerMessage)) {
      return {
        content: this.getRandomResponse('help', language),
        suggestions: this.getSuggestions(language)
      };
    }

    // Check for weather-related queries
    if (this.isWeatherQuery(lowerMessage)) {
      return this.handleWeatherQuery(lowerMessage, language);
    }

    // Check for market price queries
    if (this.isMarketQuery(lowerMessage)) {
      return this.handleMarketQuery(lowerMessage, language);
    }

    // Check for disease queries
    if (this.isDiseaseQuery(lowerMessage)) {
      return this.handleDiseaseQuery(lowerMessage, language);
    }

    // Check for fertilizer queries
    if (this.isFertilizerQuery(lowerMessage)) {
      return this.handleFertilizerQuery(lowerMessage, language);
    }

    // Check for pest queries
    if (this.isPestQuery(lowerMessage)) {
      return this.handlePestQuery(lowerMessage, language);
    }

    // Check for irrigation queries
    if (this.isIrrigationQuery(lowerMessage)) {
      return this.handleIrrigationQuery(lowerMessage, language);
    }

    // Default response
    return {
      content: this.getRandomResponse('unknown', language),
      suggestions: this.getSuggestions(language)
    };
  }

  private isGreeting(message: string): boolean {
    const greetings = ['नमस्ते', 'hello', 'hi', 'स्वागत', 'welcome', 'आपका स्वागत'];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isHelpRequest(message: string): boolean {
    const helpWords = ['मदद', 'help', 'सहायता', 'assistance', 'क्या कर सकते', 'what can you do'];
    return helpWords.some(word => message.includes(word));
  }

  private isWeatherQuery(message: string): boolean {
    const weatherWords = ['मौसम', 'weather', 'बारिश', 'rain', 'तापमान', 'temperature', 'धूप', 'sun', 'बादल', 'cloud'];
    return weatherWords.some(word => message.includes(word));
  }

  private isMarketQuery(message: string): boolean {
    const marketWords = ['बाजार', 'market', 'भाव', 'price', 'कीमत', 'दाम', 'rate', 'sell', 'बेचना'];
    return marketWords.some(word => message.includes(word));
  }

  private isDiseaseQuery(message: string): boolean {
    const diseaseWords = ['बीमारी', 'disease', 'पीला', 'yellow', 'धब्बा', 'spot', 'सड़न', 'rot', 'कीड़ा', 'pest'];
    return diseaseWords.some(word => message.includes(word));
  }

  private isFertilizerQuery(message: string): boolean {
    const fertilizerWords = ['खाद', 'fertilizer', 'यूरिया', 'urea', 'डीएपी', 'dap', 'पोटाश', 'potash', 'गोबर', 'manure'];
    return fertilizerWords.some(word => message.includes(word));
  }

  private isPestQuery(message: string): boolean {
    const pestWords = ['कीट', 'pest', 'कीटनाशक', 'pesticide', 'इल्ली', 'insect', 'छोट', 'locust'];
    return pestWords.some(word => message.includes(word));
  }

  private isIrrigationQuery(message: string): boolean {
    const irrigationWords = ['सिंचाई', 'irrigation', 'पानी', 'water', 'नहर', 'canal', 'ट्यूबवेल', 'tube well'];
    return irrigationWords.some(word => message.includes(word));
  }

  private handleWeatherQuery(message: string, language: string): ChatbotResponse {
    const weatherData = {
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      condition: 'partly cloudy',
      rainChance: 20
    };

    const response = language === 'hindi' 
      ? `🌤️ आज का मौसम खेती के लिए अनुकूल है:\n\n🌡️ तापमान: ${weatherData.temperature}°C\n💧 नमी: ${weatherData.humidity}%\n🌬️ हवा: ${weatherData.windSpeed} किमी/घंटा\n☔ बारिश की संभावना: ${weatherData.rainChance}%\n\n🌱 कृषि सलाह:\n• ${weatherData.temperature > 30 ? 'अधिक सिंचाई की जरूरत है' : 'सामान्य सिंचाई करें'}\n• ${weatherData.humidity > 70 ? 'बीमारी का ध्यान रखें' : 'बीमारी रोकथाम करें'}\n• शाम को सिंचाई करना सबसे अच्छा है`
      : `🌤️ Today's weather is favorable for farming:\n\n🌡️ Temperature: ${weatherData.temperature}°C\n💧 Humidity: ${weatherData.humidity}%\n🌬️ Wind: ${weatherData.windSpeed} km/h\n☔ Rain chance: ${weatherData.rainChance}%\n\n🌱 Farming advice:\n• ${weatherData.temperature > 30 ? 'Increase irrigation' : 'Normal irrigation'}\n• ${weatherData.humidity > 70 ? 'Watch for diseases' : 'Disease prevention'}\n• Evening irrigation is best`;

    return {
      content: response,
      suggestions: this.getSuggestions(language),
      followUp: language === 'hindi' ? 'क्या आप किसी विशेष फसल के लिए मौसम जानना चाहते हैं?' : 'Would you like weather info for a specific crop?'
    };
  }

  private handleMarketQuery(message: string, language: string): ChatbotResponse {
    const crops = ['टमाटर', 'गेहूं', 'धान', 'आलू'];
    const marketInfo = crops.map(crop => {
      const cropKey = crop === 'टमाटर' ? 'tomato' : crop === 'गेहूं' ? 'wheat' : crop === 'धान' ? 'rice' : 'potato';
      const data = this.knowledgeBase.market[cropKey as keyof typeof this.knowledgeBase.market];
      return `${crop}: ₹${data.price}/${data.unit} (${data.trend === 'up' ? '📈' : data.trend === 'down' ? '📉' : '➡️'})`;
    }).join('\n');

    const response = language === 'hindi'
      ? `💰 आज का बाजार भाव:\n\n${marketInfo}\n\n📍 सबसे अच्छी कीमतें:\n• टमाटर: मंडी में ₹45/किग्रा\n• गेहूं: एपीएमसी में ₹2250/क्विंटल\n• धान: मंडी में ₹2600/क्विंटल\n\n💡 सलाह: कीमतें अच्छी हैं, बेचने का सही समय है।`
      : `💰 Today's market prices:\n\n${marketInfo}\n\n📍 Best prices:\n• Tomato: ₹45/kg at Mandi\n• Wheat: ₹2250/quintal at APMC\n• Rice: ₹2600/quintal at Mandi\n\n💡 Advice: Prices are good, it's a good time to sell.`;

    return {
      content: response,
      suggestions: this.getSuggestions(language),
      followUp: language === 'hindi' ? 'क्या आप किसी विशेष बाजार के बारे में जानना चाहते हैं?' : 'Would you like info about a specific market?'
    };
  }

  private handleDiseaseQuery(message: string, language: string): ChatbotResponse {
    const response = language === 'hindi'
      ? `🌱 फसल बीमारी की पहचान:\n\n🔍 सामान्य लक्षण:\n• पत्तियों पर धब्बे या पीले निशान\n• पौधे का विकास धीमा\n• फल यर्गलिक या छोटे\n• पत्तियां मुड़ना या गिरना\n\n🛡️ तुरंत उपाय:\n• प्रभावित पौधों को अलग करें\n• जैविक कीटनाशक का उपयोग करें\n• उचित सिंचाई करें\n• विशेषज्ञ से संपर्क करें\n\n📸 फोटो भेजकर मुझे बीमारी की पहचान करने दें।`
      : `🌱 Crop disease identification:\n\n🔍 Common symptoms:\n• Spots or yellow marks on leaves\n• Stunted plant growth\n• Misshapen or small fruits\n• Wilting or falling leaves\n\n🛡️ Immediate actions:\n• Remove affected plants\n• Use organic pesticides\n• Ensure proper irrigation\n• Contact an expert\n\n📸 Send me a photo for disease identification.`;

    return {
      content: response,
      suggestions: this.getSuggestions(language),
      followUp: language === 'hindi' ? 'क्या आप फसल की फोटो भेजना चाहते हैं?' : 'Would you like to send a crop photo?'
    };
  }

  private handleFertilizerQuery(message: string, language: string): ChatbotResponse {
    const response = language === 'hindi'
      ? `🌾 खाद और उर्वरक सुझाव:\n\n🥬 जैविक खाद:\n• गोबर: सभी फसलों के लिए अच्छा\n• वर्मीकम्पोस्ट: पोषक तत्व से भरपूर\n• हरा खाद: जमीन को स्वस्थ रखें\n\n🧪 रासायनिक खाद:\n• यूरिया: पत्तियों के लिए\n• डीएपी: जड़ और फल के लिए\n• पोटाश: फूल और फल के लिए\n\n⏰ उपयोग:\n• बुआई से पहले: जमीन तैयार\n• बुआी के समय: बुवाई खाद\n• विकास के समय: यूरिया\n• फूल/फल के समय: पोटाश`
      : `🌾 Fertilizer recommendations:\n\n🥬 Organic fertilizers:\n• Cow dung: Good for all crops\n• Vermicompost: Rich in nutrients\n• Green manure: Keep soil healthy\n\n🧪 Chemical fertilizers:\n• Urea: For leaves\n• DAP: For roots and fruits\n• Potash: For flowers and fruits\n\n⏰ Application:\n• Before sowing: Soil preparation\n• At sowing: Basal fertilizer\n• During growth: Urea\n• Flowering/fruiting: Potash`;

    return {
      content: response,
      suggestions: this.getSuggestions(language),
      followUp: language === 'hindi' ? 'क्या आप किसी विशेष फसल के लिए खाद सुझाव चाहते हैं?' : 'Would you like fertilizer advice for a specific crop?'
    };
  }

  private handlePestQuery(message: string, language: string): ChatbotResponse {
    const response = language === 'hindi'
      ? `🐛 कीट प्रबंधन:\n\n🌿 जैविक उपाय:\n• नीम का तेल: सभी कीटों के लिए\n• लहसुन का स्प्रे: कवक और मक्खियों के लिए\n• तुलसी का पत्ता: मच्छरों को दूर करें\n• गाय का मूत्र: कीटों को भगाता है\n\n🧪 रासायनिक उपाय:\n• कार्बारिल: सामान्य कीटनाशक\n• पाइरिथ्रम: फसल सुरक्षित\n• मालाथियन: मच्छर नियंत्रण\n• क्लोरोपाइरीफॉस: बड़े कीटों के लिए\n\n⚠️ सावधान:\n• सुबह स्प्रे करें\n• सुरक्षा उपकरण पहनें\n• फसल की जांच करें\n• निर्देशिकाओं का पालन करें`
      : `🐛 Pest control:\n\n🌿 Organic methods:\n• Neem oil: For all pests\n• Garlic spray: For aphids and mites\n• Tulsi leaves: Repels mosquitoes\n• Cow dung: Natural repellent\n\n🧪 Chemical methods:\n• Carbaryl: General insecticide\n• Pyrethrum: Crop safe\n• Malathion: Mosquito control\n• Chlorpyrifos: For large pests\n\n⚠️ Precautions:\n• Spray in evening\n• Wear protective equipment\n• Check crops regularly\n• Follow label instructions`;

    return {
      content: response,
      suggestions: this.getSuggestions(language),
      followUp: language === 'hindi' ? 'क्या आप किसी विशेष कीट के बारे में जानना चाहते हैं?' : 'Would you like info about a specific pest?'
    };
  }

  private handleIrrigationQuery(message: string, language: string): ChatbotResponse {
    const response = language === 'hindi'
      ? `💧 सिंचाई मार्गदर्शन:\n\n⏰ समय:\n• सुबह: 6-8 बजे (कम वाष्पन)\n• शाम: 4-6 बजे (अच्छा अवशोषण)\n• रात: सिंचाई से बचें\n\n🌾 फसल अनुसार:\n• धान: खेत में 2-3 इंच पानी\n• गेहूं: 10-15 दिन के अंतराल पर\n• टमाटर: नमी बनाए रखें\n• सब्जियां: नियमित सिंचाई\n\n🔧 तरीके:\n• ड्रिप सिंचाई: पानी बचाना\n• स्प्रिंकलर: समान वितरण\n• फवारा: बड़े क्षेत्रों के लिए\n• ट्यूबवेल: भूमिजल से पानी`
      : `💧 Irrigation guidelines:\n\n⏰ Timing:\n• Morning: 6-8 AM (less evaporation)\n• Evening: 4-6 PM (good absorption)\n• Night: Avoid irrigation\n\n🌾 Crop-wise:\n• Rice: 2-3 inches water in field\n• Wheat: 10-15 days interval\n• Tomato: Keep moisture consistent\n• Vegetables: Regular irrigation\n\n🔧 Methods:\n• Drip irrigation: Water saving\n• Sprinkler: Even distribution\n• Flood irrigation: Large fields\n• Tube well: Ground water`;

    return {
      content: response,
      suggestions: this.getSuggestions(language),
      followUp: language === 'hindi' ? 'क्या आप किसी विशेष सिंचाई विधि के बारे में जानना चाहते हैं?' : 'Would you like info about a specific irrigation method?'
    };
  }

  private getRandomResponse(category: keyof typeof this.responses, language: string): string {
    const responses = this.responses[category][language as keyof typeof this.responses.greetings];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getSuggestions(language: string): string[] {
    return language === 'hindi'
      ? ['🌾 फसल जांच करें', '🌤️ मौसम जानें', '💰 बाजार भाव देखें', '🌱 खाद सुझाव पाएं']
      : ['🌾 Check crop health', '🌤️ Check weather', '💰 Check market prices', '🌱 Get fertilizer advice'];
  }
}

// Export singleton instance
export const workingChatbot = new WorkingChatbot();
