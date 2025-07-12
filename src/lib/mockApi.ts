// Mock API Service for Development
// This simulates real API responses when the actual backend is not available

import { DiseaseAnalysisResult, ChatMessage, WeatherData, CropRecommendation, CommunityPost, CreatePostRequest, PostResponse } from './api';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock disease detection responses
const mockDiseases = [
  {
    disease: "पत्ती का धब्बा रोग (Leaf Spot Disease)",
    confidence: 92,
    severity: "medium" as const,
    recommendations: [
      "संक्रमित पत्तियों को तुरंत हटा दें",
      "कॉपर ऑक्सीक्लोराइड का छिड़काव करें",
      "नीम तेल का प्राकृतिक उपचार करें",
      "खेत में जल निकासी सुनिश्चित करें"
    ],
    preventiveMeasures: [
      "बीज उपचार करें",
      "उचित दूरी पर बुआई करें",
      "खेत की सफाई रखें",
      "फसल चक्र अपनाएं"
    ],
    treatment: [
      "मैनकोज़ेब 75% WP का छिड़काव",
      "कार्बेन्डाजिम 50% WP का उपयोग",
      "प्रोपिकोनाजोल 25% EC का छिड़काव"
    ],
    scientificName: "Alternaria solani",
    symptoms: [
      "पत्तियों पर भूरे धब्बे",
      "धब्बों के चारों ओर पीला घेरा",
      "पत्तियों का सूखना",
      "फलों पर भी धब्बे"
    ]
  },
  {
    disease: "पाउडरी मिल्ड्यू (Powdery Mildew)",
    confidence: 88,
    severity: "high" as const,
    recommendations: [
      "संक्रमित पौधों को अलग करें",
      "सल्फर का छिड़काव करें",
      "खेत में हवा का प्रवाह बढ़ाएं",
      "रोग प्रतिरोधी किस्में बोएं"
    ],
    preventiveMeasures: [
      "उचित दूरी पर बुआई",
      "नियमित निरीक्षण",
      "जैविक कीटनाशक का प्रयोग",
      "मिट्टी की जांच करें"
    ],
    treatment: [
      "सल्फर 80% WP का छिड़काव",
      "हेक्साकोनाजोल 5% EC का उपयोग",
      "प्रोपिकोनाजोल 25% EC का छिड़काव"
    ],
    scientificName: "Erysiphe cichoracearum",
    symptoms: [
      "पत्तियों पर सफेद पाउडर",
      "पत्तियों का मुड़ना",
      "फूलों का न बनना",
      "पौधे की वृद्धि रुकना"
    ]
  },
  {
    disease: "बैक्टीरियल विल्ट (Bacterial Wilt)",
    confidence: 95,
    severity: "high" as const,
    recommendations: [
      "संक्रमित पौधों को जलाएं",
      "खेत को 2-3 साल के लिए खाली रखें",
      "रोग प्रतिरोधी किस्में बोएं",
      "जल निकासी में सुधार करें"
    ],
    preventiveMeasures: [
      "बीज उपचार करें",
      "फसल चक्र अपनाएं",
      "स्वच्छ खेती करें",
      "उचित सिंचाई"
    ],
    treatment: [
      "स्ट्रेप्टोमाइसिन का छिड़काव",
      "कॉपर ऑक्सीक्लोराइड का उपयोग",
      "जैविक कीटनाशक का प्रयोग"
    ],
    scientificName: "Ralstonia solanacearum",
    symptoms: [
      "पत्तियों का मुरझाना",
      "तने से सफेद रस निकलना",
      "जड़ों का सड़ना",
      "पौधे का मरना"
    ]
  },
  {
    disease: "कोई रोग नहीं (No Disease Detected)",
    confidence: 98,
    severity: "low" as const,
    recommendations: [
      "पौधा स्वस्थ दिख रहा है",
      "नियमित देखभाल जारी रखें",
      "उचित सिंचाई करें",
      "संतुलित खाद का प्रयोग करें"
    ],
    preventiveMeasures: [
      "नियमित निरीक्षण करें",
      "उचित दूरी बनाए रखें",
      "खेत की सफाई रखें",
      "जैविक खाद का प्रयोग करें"
    ],
    treatment: [
      "कोई उपचार आवश्यक नहीं",
      "नियमित सिंचाई जारी रखें",
      "कीट नियंत्रण के लिए नीम तेल का छिड़काव"
    ],
    scientificName: "Healthy Plant",
    symptoms: [
      "स्वस्थ पत्तियां",
      "सामान्य वृद्धि",
      "हरा रंग",
      "मजबूत तना"
    ]
  }
];

// Mock community posts
const mockCommunityPosts: CommunityPost[] = [
  {
    id: "1",
    author: "राम कुमार",
    content: "टमाटर में पत्ती का धब्बा रोग आ गया है। कोई उपाय बताएं।",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400",
    likes: 12,
    comments: 5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: "problem"
  },
  {
    id: "2",
    author: "सुनीता देवी",
    content: "गेहूं की बुआई के लिए सबसे अच्छा समय कौन सा है?",
    likes: 8,
    comments: 3,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: "tips"
  },
  {
    id: "3",
    author: "अजय सिंह",
    content: "जैविक खेती से मेरी आय दोगुनी हो गई है। सभी किसान भाइयों को सलाह दूंगा।",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
    likes: 25,
    comments: 8,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    category: "experience"
  }
];

// Enhanced bilingual chat responses
const mockChatResponses = {
  hindi: {
    // Crops
    "टमाटर": "🍅 टमाटर की खेती के लिए विस्तृत गाइड:\n\n📅 बुआई का समय: फरवरी-मार्च या जुलाई-अगस्त\n🌱 मिट्टी: दोमट मिट्टी सबसे उपयुक्त\n💧 सिंचाई: हल्की और नियमित (सप्ताह में 2-3 बार)\n🌿 खाद: NPK 20:20:20 का उपयोग करें\n🦗 कीट नियंत्रण: नीम तेल का छिड़काव करें\n💰 उपज: 25-30 टन/हेक्टेयर\n⚠️ सावधानी: जल निकासी का ध्यान रखें, उचित दूरी पर बुआई करें",
    "गेहूं": "🌾 गेहूं की खेती के लिए विस्तृत गाइड:\n\n📅 बुआई का समय: नवंबर-दिसंबर\n🌱 मिट्टी: दोमट से भारी दोमट\n💧 सिंचाई: 3-4 बार (बुआई, टिलरिंग, फूल आने पर)\n🌿 खाद: यूरिया 120kg/हेक्टेयर\n🦗 कीट नियंत्रण: इमिडाक्लोप्रिड का छिड़काव\n💰 उपज: 40-50 क्विंटल/हेक्टेयर\n⚠️ सावधानी: बीज उपचार करें, फसल चक्र अपनाएं",
    "धान": "🌾 धान की खेती के लिए विस्तृत गाइड:\n\n📅 बुआई का समय: जून-जुलाई (खरीफ)\n🌱 मिट्टी: चिकनी दोमट\n💧 सिंचाई: लगातार पानी की आवश्यकता\n🌿 खाद: NPK 120:60:60 kg/ha\n🦗 कीट नियंत्रण: कार्बोफ्यूरान का उपयोग\n💰 उपज: 25-30 क्विंटल/हेक्टेयर\n⚠️ सावधानी: नर्सरी में बीज उपचार, जल प्रबंधन",
    "मक्का": "🌽 मक्का की खेती के लिए विस्तृत गाइड:\n\n📅 बुआई का समय: जून-जुलाई या फरवरी-मार्च\n🌱 मिट्टी: दोमट मिट्टी\n💧 सिंचाई: हल्की और नियमित\n🌿 खाद: NPK 150:75:75 kg/ha\n🦗 कीट नियंत्रण: क्लोरपायरीफॉस का छिड़काव\n💰 उपज: 35-40 क्विंटल/हेक्टेयर\n⚠️ सावधानी: बीज उपचार, कीट नियंत्रण",
    
    // Weather and Climate
    "मौसम": "🌤️ आज का मौसम कृषि के लिए अनुकूल है:\n\n🌡️ तापमान: 25-30°C\n💧 आर्द्रता: 65-75%\n🌬️ हवा: 8-12 km/h\n☔ बारिश: हल्की बारिश की संभावना\n🌱 सुझाव: फसलों की सिंचाई कम करें और कीट नियंत्रण के लिए तैयार रहें",
    
    // Fertilizers and Nutrients
    "खाद": "🌿 फसल के अनुसार खाद की मात्रा:\n\n🌾 धान: NPK 120:60:60 kg/ha\n🌾 गेहूं: NPK 120:60:40 kg/ha\n🌽 मक्का: NPK 150:75:75 kg/ha\n🫘 सोयाबीन: NPK 20:80:40 kg/ha\n🍅 टमाटर: NPK 120:60:60 kg/ha\n\n🌱 जैविक खाद:\nगोबर की खाद: 10-15 टन/हेक्टेयर\nवर्मीकम्पोस्ट: 5-7 टन/हेक्टेयर\nनीम खली: 250-500 kg/हेक्टेयर\n\n💡 सुझाव: खाद बुआई के समय और टॉप ड्रेसिंग में दें",
    
    // Pest Control
    "कीट": "🦗 कीट नियंत्रण के प्राकृतिक तरीके:\n\n🌿 नीम तेल: 2ml/लीटर पानी में मिलाकर छिड़काव\n🌱 गोमूत्र: 10% घोल बनाकर छिड़काव\n🌿 लहसुन-मिर्च का घोल: प्राकृतिक कीटनाशक\n🌱 मेहंदी का पत्ता: कीट प्रतिरोधक\n\n⚠️ सावधानी: रासायनिक कीटनाशक का कम उपयोग करें",
    
    // Disease Management
    "रोग": "🦠 फसल रोग प्रबंधन:\n\n🍃 पत्ती का धब्बा: कॉपर ऑक्सीक्लोराइड का छिड़काव\n🌱 जड़ सड़न: जल निकासी में सुधार\n🍂 पाउडरी मिल्ड्यू: सल्फर का छिड़काव\n🌾 ब्लास्ट रोग: ट्रायसाइक्लाजोल का उपयोग\n\n💡 सुझाव: रोग प्रतिरोधी किस्में बोएं",
    
    // Irrigation
    "सिंचाई": "💧 सिंचाई के तरीके:\n\n🌊 फ्लड इरिगेशन: पारंपरिक तरीका\n💧 ड्रिप इरिगेशन: 40-60% पानी की बचत\n🌱 स्प्रिंकलर: समान पानी का वितरण\n🌾 फरो इरिगेशन: पंक्ति फसलों के लिए\n\n💰 लाभ: ड्रिप इरिगेशन से पानी और खाद की बचत",
    
    // Organic Farming
    "जैविक": "🌱 जैविक खेती के लाभ:\n\n🌿 जैविक खाद: गोबर, वर्मीकम्पोस्ट\n🌱 नीम खली: प्राकृतिक कीटनाशक\n🌿 जीवामृत: मिट्टी की उर्वरता बढ़ाता है\n🌱 बीजामृत: बीज उपचार के लिए\n\n💰 लाभ: कम लागत, अधिक लाभ, स्वस्थ फसल",
    
    // Market Prices
    "बाजार": "📊 आज के बाजार भाव:\n\n🌾 गेहूं: ₹2,200-2,400/क्विंटल\n🌾 धान: ₹1,800-2,000/क्विंटल\n🌽 मक्का: ₹1,500-1,700/क्विंटल\n🍅 टमाटर: ₹40-60/किलो\n🫘 सोयाबीन: ₹3,500-3,800/क्विंटल\n\n💡 सुझाव: MSP पर बेचने से अधिक लाभ",
    
    // Seed Treatment
    "बीज": "🌱 बीज उपचार के तरीके:\n\n🌿 बीजामृत: जैविक बीज उपचार\n🌱 ट्राइकोडर्मा: फंगल रोग से बचाव\n🌿 बाविस्टिन: रासायनिक बीज उपचार\n🌱 गर्म पानी: 50°C पर 30 मिनट\n\n💡 सुझाव: बीज उपचार से 20-30% अधिक उपज",
    
    // Soil Health
    "मिट्टी": "🌍 मिट्टी की जांच और सुधार:\n\n🔬 pH मान: 6.5-7.5 उपयुक्त\n🌱 जैविक कार्बन: 0.5% से अधिक होना चाहिए\n🌿 जीवाणु: मिट्टी में लाभदायक जीवाणु\n🌱 जल धारण क्षमता: बढ़ाने के लिए जैविक खाद\n\n💡 सुझाव: हर 3 साल में मिट्टी की जांच कराएं",
    
    // Government Schemes
    "योजना": "🏛️ किसानों के लिए सरकारी योजनाएं:\n\n💰 PM-KISAN: ₹6,000/वर्ष\n🌾 PMFBY: फसल बीमा योजना\n🌱 PMKSY: सिंचाई योजना\n🌿 PMFME: खाद्य प्रसंस्करण\n\n📞 जानकारी: कृषि विभाग से संपर्क करें",
    
    "default": "🌾 नमस्ते! मैं AgriSathi AI हूं। आपकी खेती संबंधी किसी भी समस्या में मदद कर सकता हूं।\n\n💡 आप इन विषयों पर पूछ सकते हैं:\n• फसल (टमाटर, गेहूं, धान, मक्का)\n• मौसम और जलवायु\n• खाद और पोषण\n• कीट और रोग नियंत्रण\n• सिंचाई तरीके\n• जैविक खेती\n• बाजार भाव\n• सरकारी योजनाएं\n\n📸 तस्वीर भेजकर रोग की पहचान भी कर सकते हैं!"
  },
  english: {
    // Crops
    "tomato": "🍅 Complete Guide for Tomato Farming:\n\n📅 Sowing Time: February-March or July-August\n🌱 Soil: Loamy soil is most suitable\n💧 Irrigation: Light and regular (2-3 times per week)\n🌿 Fertilizer: Use NPK 20:20:20\n🦗 Pest Control: Spray neem oil\n💰 Yield: 25-30 tons/hectare\n⚠️ Caution: Ensure proper drainage, maintain proper spacing",
    "wheat": "🌾 Wheat Farming Guide:\n\n📅 Sowing Time: November-December\n🌱 Soil: Loamy to heavy loamy\n💧 Irrigation: 3-4 times (sowing, tillering, flowering)\n🌿 Fertilizer: Urea 120kg/hectare\n🦗 Pest Control: Spray imidacloprid\n💰 Yield: 40-50 quintals/hectare\n⚠️ Precautions: Treat seeds, follow crop rotation",
    "rice": "🌾 Rice Farming Information:\n\n📅 Sowing: June-July (Kharif)\n🌱 Soil: Clay loam\n💧 Irrigation: Continuous water requirement\n🌿 Fertilizer: NPK 120:60:60 kg/ha\n🦗 Pest Control: Use carbofuran\n💰 Yield: 25-30 quintals/hectare\n⚠️ Precautions: Seed treatment in nursery, water management",
    "maize": "🌽 Maize Farming Tips:\n\n📅 Sowing: June-July or February-March\n🌱 Soil: Loamy soil\n💧 Irrigation: Light and regular\n🌿 Fertilizer: NPK 150:75:75 kg/ha\n🦗 Pest Control: Spray chlorpyrifos\n💰 Yield: 35-40 quintals/hectare\n⚠️ Precautions: Seed treatment, pest control",
    
    // Weather and Climate
    "weather": "🌤️ Today's weather is favorable for agriculture:\n\n🌡️ Temperature: 25-30°C\n💧 Humidity: 65-75%\n🌬️ Wind: 8-12 km/h\n☔ Rain: Light rain expected\n🌱 Suggestion: Reduce crop irrigation and be prepared for pest control",
    
    // Fertilizers and Nutrients
    "fertilizer": "🌿 Fertilizer quantity by crop:\n\n🌾 Rice: NPK 120:60:60 kg/ha\n🌾 Wheat: NPK 120:60:40 kg/ha\n🌽 Maize: NPK 150:75:75 kg/ha\n🫘 Soybean: NPK 20:80:40 kg/ha\n🍅 Tomato: NPK 120:60:60 kg/ha\n\n🌱 Organic Fertilizers:\nCow Dung: 10-15 tons/hectare\nVermicompost: 5-7 tons/hectare\nNeem Cake: 250-500 kg/hectare\n\n💡 Tip: Apply fertilizer at sowing time and top dressing",
    
    // Pest Control
    "pest": "🦗 Natural pest control methods:\n\n🌿 Neem oil: Mix 2ml/liter water and spray\n🌱 Cow urine: Make 10% solution and spray\n🌿 Garlic-chili solution: Natural pesticide\n🌱 Henna leaves: Pest repellent\n\n⚠️ Caution: Use chemical pesticides sparingly",
    
    // Disease Management
    "disease": "🦠 Crop disease management:\n\n🍃 Leaf spot: Spray copper oxychloride\n🌱 Root rot: Improve drainage\n🍂 Powdery mildew: Spray sulfur\n🌾 Blast disease: Use tricyclazole\n\n💡 Tip: Plant disease-resistant varieties",
    
    // Irrigation
    "irrigation": "💧 Irrigation methods:\n\n🌊 Flood irrigation: Traditional method\n💧 Drip irrigation: 40-60% water saving\n🌱 Sprinkler: Uniform water distribution\n🌾 Furrow irrigation: For row crops\n\n💰 Benefit: Drip irrigation saves water and fertilizer",
    
    // Organic Farming
    "organic": "🌱 Benefits of organic farming:\n\n🌿 Organic manure: Cow dung, vermicompost\n🌱 Neem cake: Natural pesticide\n🌿 Jeevamrit: Increases soil fertility\n🌱 Beejamrit: For seed treatment\n\n💰 Benefit: Low cost, high profit, healthy crop",
    
    // Market Prices
    "market": "📊 Today's market rates:\n\n🌾 Wheat: ₹2,200-2,400/quintal\n🌾 Rice: ₹1,800-2,000/quintal\n🌽 Maize: ₹1,500-1,700/quintal\n🍅 Tomato: ₹40-60/kg\n🫘 Soybean: ₹3,500-3,800/quintal\n\n💡 Tip: Selling at MSP gives more profit",
    
    // Seed Treatment
    "seed": "🌱 Seed treatment methods:\n\n🌿 Beejamrit: Organic seed treatment\n🌱 Trichoderma: Protection from fungal diseases\n🌿 Bavistin: Chemical seed treatment\n🌱 Hot water: 30 minutes at 50°C\n\n💡 Tip: Seed treatment increases yield by 20-30%",
    
    // Soil Health
    "soil": "🌍 Soil testing and improvement:\n\n🔬 pH value: 6.5-7.5 suitable\n🌱 Organic carbon: Should be more than 0.5%\n🌿 Bacteria: Beneficial bacteria in soil\n🌱 Water holding capacity: Increase with organic manure\n\n💡 Tip: Get soil tested every 3 years",
    
    // Government Schemes
    "scheme": "🏛️ Government schemes for farmers:\n\n💰 PM-KISAN: ₹6,000/year\n🌾 PMFBY: Crop insurance scheme\n🌱 PMKSY: Irrigation scheme\n🌿 PMFME: Food processing\n\n📞 Information: Contact agriculture department",
    
    "default": "🌾 Hello! I'm AgriSathi AI. I can help you with any farming-related problems.\n\n💡 You can ask about:\n• Crops (tomato, wheat, rice, maize)\n• Weather and climate\n• Fertilizers and nutrition\n• Pest and disease control\n• Irrigation methods\n• Organic farming\n• Market rates\n• Government schemes\n\n📸 You can also send photos to identify diseases!"
  }
};

export class MockApiService {
  async analyzeDisease(imageData: string, cropType?: string): Promise<DiseaseAnalysisResult> {
    await delay(2000 + Math.random() * 1000); // 2-3 seconds
    
    // Simulate different responses based on crop type
    const cropIndex = cropType ? cropType.length % mockDiseases.length : Math.floor(Math.random() * mockDiseases.length);
    return mockDiseases[cropIndex];
  }

  async sendChatMessage(message: string, context?: any): Promise<ChatMessage> {
    await delay(1000 + Math.random() * 2000); // 1-3 seconds
    
    const language = context?.language || 'hindi';
    const responses = mockChatResponses[language as keyof typeof mockChatResponses];
    
    // Enhanced keyword matching with multiple patterns
    let response = responses.default;
    const lowerMessage = message.toLowerCase();
    
    // Crop-related keywords (both Hindi and English)
    if (lowerMessage.includes('टमाटर') || lowerMessage.includes('tomato')) {
      response = language === 'hindi' ? (responses as any).टमाटर : (responses as any).tomato;
    } else if (lowerMessage.includes('गेहूं') || lowerMessage.includes('wheat') || lowerMessage.includes('गेहू')) {
      response = language === 'hindi' ? (responses as any).गेहूं : (responses as any).wheat;
    } else if (lowerMessage.includes('धान') || lowerMessage.includes('rice') || lowerMessage.includes('चावल')) {
      response = language === 'hindi' ? (responses as any).धान : (responses as any).rice;
    } else if (lowerMessage.includes('मक्का') || lowerMessage.includes('maize') || lowerMessage.includes('मकई')) {
      response = language === 'hindi' ? (responses as any).मक्का : (responses as any).maize;
    }
    // Weather and climate
    else if (lowerMessage.includes('मौसम') || lowerMessage.includes('weather') || lowerMessage.includes('जलवायु')) {
      response = language === 'hindi' ? (responses as any).मौसम : (responses as any).weather;
    }
    // Fertilizers and nutrients
    else if (lowerMessage.includes('खाद') || lowerMessage.includes('fertilizer') || lowerMessage.includes('उर्वरक') || lowerMessage.includes('पोषण')) {
      response = language === 'hindi' ? (responses as any).खाद : (responses as any).fertilizer;
    }
    // Pest control
    else if (lowerMessage.includes('कीट') || lowerMessage.includes('pest') || lowerMessage.includes('कीड़ा') || lowerMessage.includes('insect')) {
      response = language === 'hindi' ? (responses as any).कीट : (responses as any).pest;
    }
    // Disease management
    else if (lowerMessage.includes('रोग') || lowerMessage.includes('disease') || lowerMessage.includes('बीमारी')) {
      response = language === 'hindi' ? (responses as any).रोग : (responses as any).disease;
    }
    // Irrigation
    else if (lowerMessage.includes('सिंचाई') || lowerMessage.includes('irrigation') || lowerMessage.includes('पानी') || lowerMessage.includes('water')) {
      response = language === 'hindi' ? (responses as any).सिंचाई : (responses as any).irrigation;
    }
    // Organic farming
    else if (lowerMessage.includes('जैविक') || lowerMessage.includes('organic') || lowerMessage.includes('प्राकृतिक')) {
      response = language === 'hindi' ? (responses as any).जैविक : (responses as any).organic;
    }
    // Market prices
    else if (lowerMessage.includes('बाजार') || lowerMessage.includes('market') || lowerMessage.includes('भाव') || lowerMessage.includes('price')) {
      response = language === 'hindi' ? (responses as any).बाजार : (responses as any).market;
    }
    // Seed treatment
    else if (lowerMessage.includes('बीज') || lowerMessage.includes('seed') || lowerMessage.includes('उपचार')) {
      response = language === 'hindi' ? (responses as any).बीज : (responses as any).seed;
    }
    // Soil health
    else if (lowerMessage.includes('मिट्टी') || lowerMessage.includes('soil') || lowerMessage.includes('भूमि')) {
      response = language === 'hindi' ? (responses as any).मिट्टी : (responses as any).soil;
    }
    // Government schemes
    else if (lowerMessage.includes('योजना') || lowerMessage.includes('scheme') || lowerMessage.includes('सरकारी') || lowerMessage.includes('government')) {
      response = language === 'hindi' ? (responses as any).योजना : (responses as any).scheme;
    }
    // Greetings and general questions
    else if (lowerMessage.includes('नमस्ते') || lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('कैसे हो')) {
      response = language === 'hindi' 
        ? "नमस्ते! 🌾 मैं AgriSathi AI हूं। आपकी खेती संबंधी किसी भी समस्या में मदद कर सकता हूं। क्या आप कोई विशेष फसल या समस्या के बारे में जानना चाहते हैं?"
        : "Hello! 🌾 I'm AgriSathi AI. I can help you with any farming-related problems. Is there a specific crop or issue you'd like to know about?";
    }
    // Help requests
    else if (lowerMessage.includes('मदद') || lowerMessage.includes('help') || lowerMessage.includes('सहायता')) {
      response = language === 'hindi'
        ? "ज़रूर! मैं आपकी मदद कर सकता हूं। आप इन विषयों पर पूछ सकते हैं:\n\n🌾 फसल (टमाटर, गेहूं, धान, मक्का)\n🌤️ मौसम और जलवायु\n🌿 खाद और पोषण\n🦗 कीट और रोग नियंत्रण\n💧 सिंचाई तरीके\n🌱 जैविक खेती\n📊 बाजार भाव\n🏛️ सरकारी योजनाएं\n\n📸 तस्वीर भेजकर रोग की पहचान भी कर सकते हैं!"
        : "Of course! I can help you. You can ask about:\n\n🌾 Crops (tomato, wheat, rice, maize)\n🌤️ Weather and climate\n🌿 Fertilizers and nutrition\n🦗 Pest and disease control\n💧 Irrigation methods\n🌱 Organic farming\n📊 Market rates\n🏛️ Government schemes\n\n📸 You can also send photos to identify diseases!";
    }
    
    return {
      id: Date.now().toString(),
      sender: 'bot',
      content: response,
      timestamp: new Date(),
      type: 'text'
    };
  }

  async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    await delay(500);
    
    return {
      temperature: 28 + Math.random() * 8,
      humidity: 60 + Math.random() * 30,
      windSpeed: 5 + Math.random() * 15,
      description: "Partly cloudy with light rain",
      icon: "cloud-rain",
      forecast: [
        { date: "2024-01-15", temp: 26, description: "Sunny" },
        { date: "2024-01-16", temp: 24, description: "Cloudy" },
        { date: "2024-01-17", temp: 27, description: "Partly cloudy" }
      ]
    };
  }

  async getCropRecommendations(soilType: string, season: string, location: string): Promise<CropRecommendation[]> {
    await delay(1000);
    
    return [
      {
        crop: "गेहूं (Wheat)",
        confidence: 95,
        reasons: ["उपयुक्त मौसम", "अच्छी मिट्टी", "पानी की उपलब्धता"],
        plantingTime: "नवंबर-दिसंबर",
        careInstructions: ["नियमित सिंचाई", "खाद का उपयोग", "कीट नियंत्रण"]
      },
      {
        crop: "सरसों (Mustard)",
        confidence: 88,
        reasons: ["ठंडा मौसम", "कम पानी की आवश्यकता"],
        plantingTime: "अक्टूबर-नवंबर",
        careInstructions: ["हल्की सिंचाई", "जैविक खाद", "कीट नियंत्रण"]
      }
    ];
  }

  async getAvailableExperts(): Promise<any[]> {
    await delay(500);
    
    return [
      {
        id: "1",
        name: "डॉ. सुरेश कुमार",
        specialty: "पादप रोग विशेषज्ञ",
        rating: 4.8,
        available: true,
        price: "₹50/10 मिनट",
        experience: "15+ years",
        languages: ["Hindi", "English"]
      },
      {
        id: "2",
        name: "राज्या लक्ष्मी",
        specialty: "जैविक खेती सलाहकार",
        rating: 4.9,
        available: false,
        nextAvailable: "2:00 PM",
        experience: "12+ years",
        languages: ["Hindi", "Telugu"]
      }
    ];
  }

  // Community API Methods
  async getCommunityPosts(): Promise<CommunityPost[]> {
    await delay(800);
    return [...mockCommunityPosts];
  }

  async createPost(postData: CreatePostRequest): Promise<PostResponse> {
    await delay(1500);
    
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: "आप (You)",
      content: postData.content,
      image: postData.image,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      category: postData.category
    };
    
    return {
      success: true,
      post: newPost
    };
  }

  async likePost(postId: string): Promise<any> {
    await delay(500);
    return { success: true, likes: Math.floor(Math.random() * 50) + 1 };
  }

  async getMarketPrices(crop?: string): Promise<any[]> {
    await delay(500);
    
    return [
      { crop: "गेहूं", price: "₹2,200-2,400", unit: "क्विंटल" },
      { crop: "धान", price: "₹1,800-2,000", unit: "क्विंटल" },
      { crop: "मक्का", price: "₹1,500-1,700", unit: "क्विंटल" },
      { crop: "टमाटर", price: "₹40-60", unit: "किलो" }
    ];
  }

  async analyzeSoil(imageData: string): Promise<any> {
    await delay(2000);
    
    return {
      pH: 6.8,
      nitrogen: "Medium",
      phosphorus: "High",
      potassium: "Medium",
      organicCarbon: "0.6%",
      recommendations: [
        "Add organic manure",
        "Maintain pH between 6.5-7.5",
        "Use balanced fertilizers"
      ]
    };
  }
}

export class MockAiService {
  async advancedDiseaseDetection(imageData: string): Promise<DiseaseAnalysisResult> {
    await delay(3000);
    return mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
  }

  async processNaturalLanguage(text: string, language: string = 'hindi'): Promise<any> {
    await delay(500);
    return {
      intent: "agriculture_question",
      entities: ["crop", "disease", "weather"],
      confidence: 0.85,
      language: language,
      sentiment: "neutral"
    };
  }

  async preprocessImage(imageData: string): Promise<string> {
    await delay(1000);
    return imageData;
  }
} 