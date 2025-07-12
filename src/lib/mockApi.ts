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
    disease: "बैक्टीरियल विल्ट (Bacterial Wilt)",
    confidence: 87,
    severity: "high" as const,
    recommendations: [
      "संक्रमित पौधों को जड़ से उखाड़ दें",
      "खेत को 2-3 साल के लिए खाली रखें",
      "बीज को गर्म पानी से उपचारित करें",
      "जल निकासी में सुधार करें"
    ],
    preventiveMeasures: [
      "रोग प्रतिरोधी किस्में बोएं",
      "स्वस्थ बीज का उपयोग करें",
      "खेत की सफाई रखें",
      "फसल चक्र अपनाएं"
    ],
    treatment: [
      "संक्रमित पौधों का तुरंत निष्कासन",
      "खेत की मिट्टी का सौर उपचार",
      "जैविक कवकनाशी का उपयोग"
    ],
    scientificName: "Ralstonia solanacearum",
    symptoms: [
      "पत्तियों का मुरझाना",
      "तने का काला पड़ना",
      "जड़ों का सड़ना",
      "पौधे का अचानक मरना"
    ]
  },
  {
    disease: "पाउडरी मिल्ड्यू (Powdery Mildew)",
    confidence: 95,
    severity: "low" as const,
    recommendations: [
      "सल्फर युक्त कवकनाशी का छिड़काव करें",
      "पौधों के बीच हवा का प्रवाह बढ़ाएं",
      "सुबह के समय पानी दें",
      "संक्रमित भागों को काट दें"
    ],
    preventiveMeasures: [
      "उचित दूरी पर पौधे लगाएं",
      "सुबह के समय सिंचाई करें",
      "पौधों को छाया में रखें",
      "नाइट्रोजन की मात्रा कम करें"
    ],
    treatment: [
      "सल्फर 80% WP का छिड़काव",
      "ट्रायडिमेफॉन 25% WP का उपयोग",
      "हेक्साकोनाजोल 5% EC का छिड़काव"
    ],
    scientificName: "Erysiphe cichoracearum",
    symptoms: [
      "पत्तियों पर सफेद पाउडर",
      "पत्तियों का पीला पड़ना",
      "फूलों का विकृत होना",
      "फलों का छोटा रह जाना"
    ]
  }
];

// Mock community posts data
const mockCommunityPosts: CommunityPost[] = [
  {
    id: "1",
    author: "राम कुमार",
    location: "पंजाब",
    time: "2 घंटे पहले",
    content: "मेरे गेहूं की फसल में पीले धब्बे दिख रहे हैं। क्या यह कोई बीमारी है? कृपया सुझाव दें।",
    image: "🌾",
    likes: 12,
    comments: 5,
    agriCreds: 25,
    category: "community.category.problem",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: "user1"
  },
  {
    id: "2",
    author: "सुनीता देवी",
    location: "हरियाणा",
    time: "4 घंटे पहले",
    content: "जैविक खाद बनाने का आसान तरीका। गोबर + नीम की पत्ती + गुड़ मिलाकर 15 दिन में तैयार होती है।",
    image: "🌱",
    likes: 28,
    comments: 8,
    agriCreds: 50,
    category: "community.category.tips",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    userId: "user2"
  },
  {
    id: "3",
    author: "अजय सिंह",
    location: "उत्तर प्रदेश", 
    time: "6 घंटे पहले",
    content: "ड्रिप सिंचाई लगाने के बाद 40% पानी की बचत हुई। बहुत फायदेमंद है!",
    image: "💧",
    likes: 35,
    comments: 12,
    agriCreds: 75,
    category: "community.category.experience",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    userId: "user3"
  }
];

// Mock chatbot responses
const mockChatResponses = {
  hindi: {
    "टमाटर": "टमाटर की खेती के लिए कुछ महत्वपूर्ण सुझाव:\n\n• बीज बोने का सबसे अच्छा समय: फरवरी-मार्च या जुलाई-अगस्त\n• मिट्टी: दोमट मिट्टी सबसे उपयुक्त\n• सिंचाई: हल्की और नियमित\n• खाद: NPK 20:20:20 का उपयोग करें\n• कीट नियंत्रण: नीम तेल का छिड़काव करें",
    "गेहूं": "गेहूं की खेती के लिए सुझाव:\n\n• बुआई का समय: नवंबर-दिसंबर\n• मिट्टी: दोमट से भारी दोमट\n• सिंचाई: 3-4 बार (बुआई, टिलरिंग, फूल आने पर)\n• खाद: यूरिया 120kg/हेक्टेयर\n• कटाई: जब पौधे पीले हो जाएं",
    "मौसम": "आज का मौसम कृषि के लिए अनुकूल है। तापमान 25-30°C के बीच है। हल्की बारिश की संभावना है। फसलों की सिंचाई कम करें और कीट नियंत्रण के लिए तैयार रहें।",
    "खाद": "फसल के अनुसार खाद की मात्रा:\n\n• धान: NPK 120:60:60 kg/ha\n• गेहूं: NPK 120:60:40 kg/ha\n• मक्का: NPK 150:75:75 kg/ha\n• सोयाबीन: NPK 20:80:40 kg/ha\n\nखाद बुआई के समय और टॉप ड्रेसिंग में दें।",
    "default": "मैं आपकी कैसे मदद कर सकता हूं? आप फसल, मौसम, खाद, कीट नियंत्रण या किसी अन्य कृषि समस्या के बारे में पूछ सकते हैं।"
  },
  english: {
    "tomato": "Here are some important tips for tomato farming:\n\n• Best time to sow: February-March or July-August\n• Soil: Loamy soil is most suitable\n• Irrigation: Light and regular\n• Fertilizer: Use NPK 20:20:20\n• Pest control: Spray neem oil",
    "wheat": "Suggestions for wheat farming:\n\n• Sowing time: November-December\n• Soil: Loamy to heavy loamy\n• Irrigation: 3-4 times (sowing, tillering, flowering)\n• Fertilizer: Urea 120kg/hectare\n• Harvesting: When plants turn yellow",
    "weather": "Today's weather is favorable for agriculture. Temperature is between 25-30°C. Light rain is expected. Reduce crop irrigation and be prepared for pest control.",
    "fertilizer": "Fertilizer quantity according to crop:\n\n• Rice: NPK 120:60:60 kg/ha\n• Wheat: NPK 120:60:40 kg/ha\n• Maize: NPK 150:75:75 kg/ha\n• Soybean: NPK 20:80:40 kg/ha\n\nApply fertilizer at sowing time and top dressing.",
    "default": "How can I help you? You can ask about crops, weather, fertilizers, pest control, or any other agricultural problem."
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
    
    // Simple keyword matching
    let response = responses.default;
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('टमाटर') || lowerMessage.includes('tomato')) {
      response = language === 'hindi' ? (responses as any).टमाटर : (responses as any).tomato || responses.default;
    } else if (lowerMessage.includes('गेहूं') || lowerMessage.includes('wheat')) {
      response = language === 'hindi' ? (responses as any).गेहूं : (responses as any).wheat || responses.default;
    } else if (lowerMessage.includes('मौसम') || lowerMessage.includes('weather')) {
      response = language === 'hindi' ? (responses as any).मौसम : (responses as any).weather || responses.default;
    } else if (lowerMessage.includes('खाद') || lowerMessage.includes('fertilizer')) {
      response = language === 'hindi' ? (responses as any).खाद : (responses as any).fertilizer || responses.default;
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
  async getCommunityPosts(category?: string, limit: number = 20): Promise<CommunityPost[]> {
    await delay(800);
    
    let filteredPosts = [...mockCommunityPosts];
    
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    return filteredPosts.slice(0, limit);
  }

  async createCommunityPost(postData: CreatePostRequest): Promise<PostResponse> {
    await delay(1500);
    
    const newPost: CommunityPost = {
      id: (mockCommunityPosts.length + 1).toString(),
      author: "आप",
      location: postData.location || "आपका स्थान",
      time: "अभी",
      content: postData.content,
      image: postData.image,
      likes: 0,
      comments: 0,
      agriCreds: 10,
      category: postData.category,
      timestamp: new Date(),
      userId: postData.userId || "current_user"
    };
    
    // Add to mock data
    mockCommunityPosts.unshift(newPost);
    
    return {
      success: true,
      post: newPost,
      message: "पोस्ट सफलतापूर्वक बनाई गई!"
    };
  }

  async likeCommunityPost(postId: string, userId: string): Promise<{ success: boolean; likes: number }> {
    await delay(500);
    
    const post = mockCommunityPosts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      return { success: true, likes: post.likes };
    }
    
    return { success: false, likes: 0 };
  }

  async addCommentToPost(postId: string, comment: string, userId: string): Promise<any> {
    await delay(800);
    
    const post = mockCommunityPosts.find(p => p.id === postId);
    if (post) {
      post.comments += 1;
      return {
        success: true,
        comment: {
          id: Date.now().toString(),
          content: comment,
          author: "आप",
          timestamp: new Date()
        }
      };
    }
    
    return { success: false };
  }

  async uploadCommunityImage(imageData: string, fileName: string): Promise<{ imageUrl: string }> {
    await delay(2000);
    
    // Simulate image upload and return a mock URL
    return {
      imageUrl: `https://mock-storage.agrisathi.com/community/${Date.now()}_${fileName}`
    };
  }
}

export class MockAiService {
  async advancedDiseaseDetection(imageData: string): Promise<DiseaseAnalysisResult> {
    await delay(3000 + Math.random() * 2000); // 3-5 seconds for advanced analysis
    
    // Simulate more accurate results
    const baseDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    return {
      ...baseDisease,
      confidence: Math.min(100, baseDisease.confidence + 5 + Math.random() * 10)
    };
  }

  async processNaturalLanguage(text: string, language: string = 'hindi'): Promise<any> {
    await delay(500);
    
    return {
      intent: "agriculture_question",
      entities: ["crop", "disease", "weather"],
      confidence: 0.85,
      language: language
    };
  }

  async preprocessImage(imageData: string): Promise<string> {
    await delay(1000);
    
    // Return the same image (in real implementation, this would enhance the image)
    return imageData;
  }
} 