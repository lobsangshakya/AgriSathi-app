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
    "टमाटर": "टमाटर की खेती के लिए विस्तृत गाइड:\n\nबुआई का समय: फरवरी-मार्च या जुलाई-अगस्त\nमिट्टी: दोमट मिट्टी सबसे उपयुक्त\nसिंचाई: हल्की और नियमित (सप्ताह में 2-3 बार)\nखाद: NPK 20:20:20 का उपयोग करें\nकीट नियंत्रण: नीम तेल का छिड़काव करें\nउपज: 25-30 टन/हेक्टेयर\nसावधानी: जल निकासी का ध्यान रखें, उचित दूरी पर बुआई करें",
    "गेहूं": "गेहूं की खेती के लिए विस्तृत गाइड:\n\nबुआई का समय: नवंबर-दिसंबर\nमिट्टी: दोमट से भारी दोमट\nसिंचाई: 3-4 बार (बुआई, टिलरिंग, फूल आने पर)\nखाद: यूरिया 120kg/हेक्टेयर\nकीट नियंत्रण: इमिडाक्लोप्रिड का छिड़काव\nउपज: 40-50 क्विंटल/हेक्टेयर\nसावधानी: बीज उपचार करें, फसल चक्र अपनाएं",
    "धान": "धान की खेती के लिए विस्तृत गाइड:\n\nबुआई का समय: जून-जुलाई (खरीफ)\nमिट्टी: चिकनी दोमट\nसिंचाई: लगातार पानी की आवश्यकता\nखाद: NPK 120:60:60 kg/ha\nकीट नियंत्रण: कार्बोफ्यूरान का उपयोग\nउपज: 25-30 क्विंटल/हेक्टेयर\nसावधानी: नर्सरी में बीज उपचार, जल प्रबंधन",
    "मक्का": "मक्का की खेती के लिए विस्तृत गाइड:\n\nबुआई का समय: जून-जुलाई या फरवरी-मार्च\nमिट्टी: दोमट मिट्टी\nसिंचाई: हल्की और नियमित\nखाद: NPK 150:75:75 kg/ha\nकीट नियंत्रण: क्लोरपायरीफॉस का छिड़काव\nउपज: 35-40 क्विंटल/हेक्टेयर\nसावधानी: बीज उपचार, कीट नियंत्रण",
    
    // Weather and Climate
    "मौसम": "आज का मौसम कृषि के लिए अनुकूल है:\n\nतापमान: 25-30°C\nआर्द्रता: 65-75%\nहवा: 8-12 km/h\nबारिश: हल्की बारिश की संभावना\nसुझाव: फसलों की सिंचाई कम करें और कीट नियंत्रण के लिए तैयार रहें",
    
    // Fertilizers and Nutrients
    "खाद": "फसल के अनुसार खाद की मात्रा:\n\nधान: NPK 120:60:60 kg/ha\nगेहूं: NPK 120:60:40 kg/ha\nमक्का: NPK 150:75:75 kg/ha\nसोयाबीन: NPK 20:80:40 kg/ha\nटमाटर: NPK 120:60:60 kg/ha\n\nजैविक खाद:\nगोबर की खाद: 10-15 टन/हेक्टेयर\nवर्मीकम्पोस्ट: 5-7 टन/हेक्टेयर\nनीम खली: 250-500 kg/हेक्टेयर\n\nसुझाव: खाद बुआई के समय और टॉप ड्रेसिंग में दें",
    
    // Pest Control
    "कीट": "कीट नियंत्रण के प्राकृतिक तरीके:\n\nनीम तेल: 2ml/लीटर पानी में मिलाकर छिड़काव\nगोमूत्र: 10% घोल बनाकर छिड़काव\nलहसुन-मिर्च का घोल: प्राकृतिक कीटनाशक\nमेहंदी का पत्ता: कीट प्रतिरोधक\n\nसावधानी: रासायनिक कीटनाशक का कम उपयोग करें",
    
    // Disease Management
    "रोग": "फसल रोग प्रबंधन:\n\nपत्ती का धब्बा: कॉपर ऑक्सीक्लोराइड का छिड़काव\nजड़ सड़न: जल निकासी में सुधार\nपाउडरी मिल्ड्यू: सल्फर का छिड़काव\nब्लास्ट रोग: ट्रायसाइक्लाजोल का उपयोग\n\nसुझाव: रोग प्रतिरोधी किस्में बोएं",
    
    // Irrigation
    "सिंचाई": "सिंचाई के तरीके:\n\nफ्लड इरिगेशन: पारंपरिक तरीका\nड्रिप इरिगेशन: 40-60% पानी की बचत\nस्प्रिंकलर: समान पानी का वितरण\nफरो इरिगेशन: पंक्ति फसलों के लिए\n\nलाभ: ड्रिप इरिगेशन से पानी और खाद की बचत",
    
    // Organic Farming
    "जैविक": "जैविक खेती के लाभ:\n\nजैविक खाद: गोबर, वर्मीकम्पोस्ट\nनीम खली: प्राकृतिक कीटनाशक\nजीवामृत: मिट्टी की उर्वरता बढ़ाता है\nबीजामृत: बीज उपचार के लिए\n\nलाभ: कम लागत, अधिक लाभ, स्वस्थ फसल",
    
    // Market Prices
    "बाजार": "आज के बाजार भाव:\n\nगेहूं: ₹2,200-2,400/क्विंटल\nधान: ₹1,800-2,000/क्विंटल\nमक्का: ₹1,500-1,700/क्विंटल\nटमाटर: ₹40-60/किलो\nसोयाबीन: ₹3,500-3,800/क्विंटल\n\nसुझाव: MSP पर बेचने से अधिक लाभ",
    
    // Seed Treatment
    "बीज": "बीज उपचार के तरीके:\n\nबीजामृत: जैविक बीज उपचार\nट्राइकोडर्मा: फंगल रोग से बचाव\nबाविस्टिन: रासायनिक बीज उपचार\nगर्म पानी: 50°C पर 30 मिनट\n\nसुझाव: बीज उपचार से 20-30% अधिक उपज",
    
    // Soil Health
    "मिट्टी": "मिट्टी की जांच और सुधार:\n\npH मान: 6.5-7.5 उपयुक्त\nजैविक कार्बन: 0.5% से अधिक होना चाहिए\nजीवाणु: मिट्टी में लाभदायक जीवाणु\nजल धारण क्षमता: बढ़ाने के लिए जैविक खाद\n\nसुझाव: हर 3 साल में मिट्टी की जांच कराएं",
    
    // Government Schemes
    "योजना": "किसानों के लिए सरकारी योजनाएं:\n\nPM-KISAN: ₹6,000/वर्ष\nPMFBY: फसल बीमा योजना\nPMKSY: सिंचाई योजना\nPMFME: खाद्य प्रसंस्करण\n\nजानकारी: कृषि विभाग से संपर्क करें",
    
    "default": "नमस्ते! मैं AgriSathi AI हूं। आपकी खेती संबंधी किसी भी समस्या में मदद कर सकता हूं।\n\nआप इन विषयों पर पूछ सकते हैं:\n• फसल (टमाटर, गेहूं, धान, मक्का)\n• मौसम और जलवायु\n• खाद और पोषण\n• कीट और रोग नियंत्रण\n• सिंचाई तरीके\n• जैविक खेती\n• बाजार भाव\n• सरकारी योजनाएं\n\nतस्वीर भेजकर रोग की पहचान भी कर सकते हैं!"
  },
  english: {
    // Crops
    "tomato": "Complete Guide for Tomato Farming:\n\nSowing Time: February-March or July-August\nSoil: Loamy soil is most suitable\nIrrigation: Light and regular (2-3 times per week)\nFertilizer: Use NPK 20:20:20\nPest Control: Spray neem oil\nYield: 25-30 tons/hectare\nCaution: Ensure proper drainage, maintain proper spacing",
    "wheat": "Wheat Farming Guide:\n\nSowing Time: November-December\nSoil: Loamy to heavy loamy\nIrrigation: 3-4 times (sowing, tillering, flowering)\nFertilizer: Urea 120kg/hectare\nPest Control: Spray imidacloprid\nYield: 40-50 quintals/hectare\nPrecautions: Treat seeds, follow crop rotation",
    "rice": "Rice Farming Information:\n\nSowing: June-July (Kharif)\nSoil: Clay loam\nIrrigation: Continuous water requirement\nFertilizer: NPK 120:60:60 kg/ha\nPest Control: Use carbofuran\nYield: 25-30 quintals/hectare\nPrecautions: Seed treatment in nursery, water management",
    "maize": "Maize Farming Tips:\n\nSowing: June-July or February-March\nSoil: Loamy soil\nIrrigation: Light and regular\nFertilizer: NPK 150:75:75 kg/ha\nPest Control: Spray chlorpyrifos\nYield: 35-40 quintals/hectare\nPrecautions: Seed treatment, pest control",
    
    // Weather and Climate
    "weather": "Today's weather is favorable for agriculture:\n\nTemperature: 25-30°C\nHumidity: 65-75%\nWind: 8-12 km/h\nRain: Light rain expected\nSuggestion: Reduce crop irrigation and be prepared for pest control",
    
    // Fertilizers and Nutrients
    "fertilizer": "Fertilizer quantity by crop:\n\nRice: NPK 120:60:60 kg/ha\nWheat: NPK 120:60:40 kg/ha\nMaize: NPK 150:75:75 kg/ha\nSoybean: NPK 20:80:40 kg/ha\nTomato: NPK 120:60:60 kg/ha\n\nOrganic Fertilizers:\nCow Dung: 10-15 tons/hectare\nVermicompost: 5-7 tons/hectare\nNeem Cake: 250-500 kg/hectare\n\nTip: Apply fertilizer at sowing time and top dressing",
    
    // Pest Control
    "pest": "Natural pest control methods:\n\nNeem oil: Mix 2ml/liter water and spray\nCow urine: Make 10% solution and spray\nGarlic-chili solution: Natural pesticide\nHenna leaves: Pest repellent\n\nCaution: Use chemical pesticides sparingly",
    
    // Disease Management
    "disease": "Crop disease management:\n\nLeaf spot: Spray copper oxychloride\nRoot rot: Improve drainage\nPowdery mildew: Spray sulfur\nBlast disease: Use tricyclazole\n\nTip: Plant disease-resistant varieties",
    
    // Irrigation
    "irrigation": "Irrigation methods:\n\nFlood irrigation: Traditional method\nDrip irrigation: 40-60% water saving\nSprinkler: Uniform water distribution\nFurrow irrigation: For row crops\n\nBenefit: Drip irrigation saves water and fertilizer",
    
    // Organic Farming
    "organic": "Benefits of organic farming:\n\nOrganic manure: Cow dung, vermicompost\nNeem cake: Natural pesticide\nJeevamrit: Increases soil fertility\nBeejamrit: For seed treatment\n\nBenefit: Low cost, high profit, healthy crop",
    
    // Market Prices
    "market": "Today's market rates:\n\nWheat: ₹2,200-2,400/quintal\nRice: ₹1,800-2,000/quintal\nMaize: ₹1,500-1,700/quintal\nTomato: ₹40-60/kg\nSoybean: ₹3,500-3,800/quintal\n\nTip: Selling at MSP gives more profit",
    
    // Seed Treatment
    "seed": "Seed treatment methods:\n\nBeejamrit: Organic seed treatment\nTrichoderma: Protection from fungal diseases\nBavistin: Chemical seed treatment\nHot water: 30 minutes at 50°C\n\nTip: Seed treatment increases yield by 20-30%",
    
    // Soil Health
    "soil": "Soil testing and improvement:\n\npH value: 6.5-7.5 suitable\nOrganic carbon: Should be more than 0.5%\nBacteria: Beneficial bacteria in soil\nWater holding capacity: Increase with organic manure\n\nTip: Get soil tested every 3 years",
    
    // Government Schemes
    "scheme": "Government schemes for farmers:\n\nPM-KISAN: ₹6,000/year\nPMFBY: Crop insurance scheme\nPMKSY: Irrigation scheme\nPMFME: Food processing\n\nInformation: Contact agriculture department",
    
    "default": "Hello! I'm AgriSathi AI. I can help you with any farming-related problems.\n\nYou can ask about:\n• Crops (tomato, wheat, rice, maize)\n• Weather and climate\n• Fertilizers and nutrition\n• Pest and disease control\n• Irrigation methods\n• Organic farming\n• Market rates\n• Government schemes\n\nYou can also send photos to identify diseases!"
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
        ? "नमस्ते! मैं AgriSathi AI हूं। आपकी खेती संबंधी किसी भी समस्या में मदद कर सकता हूं। क्या आप कोई विशेष फसल या समस्या के बारे में जानना चाहते हैं?"
        : "Hello! I'm AgriSathi AI. I can help you with any farming-related problems. Is there a specific crop or issue you'd like to know about?";
    }
    // Help requests
    else if (lowerMessage.includes('मदद') || lowerMessage.includes('help') || lowerMessage.includes('सहायता')) {
      response = language === 'hindi'
        ? "ज़रूर! मैं आपकी मदद कर सकता हूं। आप इन विषयों पर पूछ सकते हैं:\n\nफसल (टमाटर, गेहूं, धान, मक्का)\nमौसम और जलवायु\nखाद और पोषण\nकीट और रोग नियंत्रण\nसिंचाई तरीके\nजैविक खेती\nबाजार भाव\nसरकारी योजनाएं\n\nतस्वीर भेजकर रोग की पहचान भी कर सकते हैं!"
        : "Of course! I can help you. You can ask about:\n\nCrops (tomato, wheat, rice, maize)\nWeather and climate\nFertilizers and nutrition\nPest and disease control\nIrrigation methods\nOrganic farming\nMarket rates\nGovernment schemes\n\nYou can also send photos to identify diseases!";
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