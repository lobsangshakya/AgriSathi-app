import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'hindi' | 'english';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  hindi: {
    // Header
    'header.agrisathi': 'AgriSathi',
    'header.language.hindi': 'हिं',
    'header.language.english': 'EN',
    
    // Navigation
    'nav.home': 'होम',
    'nav.scan': 'स्कैन',
    'nav.community': 'समुदाय',
    'nav.chat': 'चैट',
    'nav.profile': 'प्रोफाइल',
    
    // Dashboard
    'dashboard.welcome': 'स्वागत है, किसान भाई!',
    'dashboard.subtitle': 'आधुनिक तकनीक के साथ बेहतर खेती',
    'dashboard.quickActions': 'त्वरित कार्य',
    'dashboard.weather': 'आज का मौसम',
    'dashboard.cropRecommendations': 'फसल सुझाव',
    
    // Quick Actions
    'quickActions.scanCrop': 'फसल स्कैन करें',
    'quickActions.scanDescription': 'बीमारी की पहचान',
    'quickActions.voiceAsk': 'आवाज में पूछें',
    'quickActions.voiceDescription': 'स्वरबद्ध सहायक',
    'quickActions.expertChat': 'विशेषज्ञ चैट',
    'quickActions.expertDescription': 'तुरंत सलाह पाएं',
    'quickActions.weather': 'मौसम जानकारी',
    'quickActions.weatherDescription': 'आज का पूर्वानुमान',
    'quickActions.agriCreds': 'AgriCreds',
    'quickActions.earnMore': 'समुदाय में योगदान करके और अधिक कमाएं!',
    
    // Weather
    'weather.today': 'आज का मौसम',
    'weather.humidity': 'नमी',
    'weather.wind': 'हवा',
    'weather.uvIndex': 'UV Index',
    'weather.rainChance': 'बारिश की संभावना',
    
    // Crop Recommendations
    'crops.recommendations': 'फसल सुझाव',
    'crops.season': 'सीजन',
    'crops.profitability': 'लाभ',
    'crops.high': 'उच्च',
    'crops.medium': 'मध्यम',
    'crops.low': 'कम',
    'crops.yield': 'उत्पादन',
    'crops.sowing': 'बुआई',
    'crops.marketRate': 'बाजार दर',
    'crops.viewDetails': 'विस्तार देखें',
    'crops.alerts': 'चेतावनी',
    
    // Crops
    'crops.tomato': 'टमाटर',
    'crops.wheat': 'गेहूं',
    'crops.season.rabi': 'रबी',
    'crops.season.kharif': 'खरीफ',
    'crops.profitability.high': 'उच्च',
    'crops.profitability.medium': 'मध्यम',
    'crops.profitability.low': 'कम',
    'crops.yield.ton_per_hectare': 'टन/हेक्टेयर',
    'crops.yield.qtl_per_hectare': 'क्विंटल/हेक्टेयर',
    'crops.market_unit.kg': 'किग्रा',
    'crops.market_unit.qtl': 'क्विंटल',
    'crops.sowing.oct_nov': 'अक्टूबर-नवंबर',
    'crops.sowing.nov_dec': 'नवंबर-दिसंबर',
    // Alerts
    'alerts.tomato_pest': '🐛 टमाटर में कीट प्रकोप की चेतावनी - तुरंत उपचार करें',
    'alerts.irrigation_needed': '💧 सिंचाई की जरूरत - मिट्टी की नमी कम है',
    
    // Disease Detection
    'disease.title': 'फसल स्कैन करें',
    'disease.uploadPhoto': 'फसल की फोटो अपलोड करें',
    'disease.uploadDescription': 'पत्तियों, फूलों या फलों की स्पष्ट तस्वीर लें',
    'disease.gallery': 'गैलरी से चुनें',
    'disease.camera': 'कैमरा खोलें',
    'disease.uploadedPhoto': 'अपलोड की गई फोटो',
    'disease.startAnalysis': 'AI विश्लेषण शुरू करें',
    'disease.analyzing': 'AI विश्लेषण चल रहा है...',
    'disease.pleaseWait': 'कृपया प्रतीक्षा करें',
    'disease.confidence': 'आत्मविश्वास',
    'disease.severity': 'गंभीरता',
    'disease.immediateActions': 'तुरंत करने योग्य उपाय',
    'disease.futurePrevention': 'भविष्य में बचाव',
    'disease.contactExpert': 'विशेषज्ञ से संपर्क करें',
    'disease.buyMedicine': 'दवाई खरीदें',
    'disease.tips': 'बेहतर परिणाम के लिए टिप्स',
    'disease.tip1': 'प्राकृतिक रोशनी में फोटो लें',
    'disease.tip2': 'पत्ती को पास से फोकस करें',
    'disease.tip3': 'साफ़ और स्पष्ट तस्वीर लें',
    'disease.tip4': 'एक से अधिक कोण से फोटो लें',
    
    // Chat
    'chat.title': 'AI चैट सहायक',
    'chat.expertBanner': 'विशेषज्ञ सलाह चाहिए?',
    'chat.expertSubtitle': 'प्रमाणित कृषि विशेषज्ञों से बात करें',
    'chat.call': 'कॉल करें',
    'chat.availableExperts': 'उपलब्ध विशेषज्ञ',
    'chat.chat': 'चैट',
    'chat.nextAvailable': 'अगली बार',
    'chat.voiceListening': 'सुन रहा हूं...',
    'chat.speakQuestion': 'अपना सवाल बोलें',
    'chat.writeQuestion': 'अपना सवाल लिखें...',
    'chat.commonQuestions': 'आम सवाल',
    'chat.weatherInfo': 'मौसम की जानकारी',
    'chat.fertilizerAmount': 'खाद की मात्रा',
    'chat.seedTreatment': 'बीज उपचार',
    'chat.irrigationTime': 'सिंचाई का समय',
    'chat.placeholder': 'अपना संदेश लिखें...',
    'chat.typing': 'टाइप कर रहा है...',
    'chat.clear': 'साफ़ करें',
    'chat.cleared': 'चैट साफ़ की गई',
    'chat.startNewConversation': 'नई बातचीत शुरू करें',
    'chat.responseReceived': 'जवाब मिला',
    'chat.usingRealData': 'वास्तविक कृषि डेटा का उपयोग',
    'chat.usingMockData': 'मॉक डेटा का उपयोग',
    'chat.apiError': 'API त्रुटि',
    'chat.error': 'जवाब प्राप्त करने में विफल',
    
    // Community
    'community.title': 'समुदाय मंच',
    'community.searchPosts': 'पोस्ट खोजें...',
    'community.post': 'पोस्ट',
    'community.newPost': 'नई पोस्ट लिखें',
    'community.category': 'श्रेणी',
    'community.writeQuestion': 'अपना सवाल या सुझाव लिखें...',
    'community.addPhoto': 'फोटो जोड़ें',
    'community.postNow': 'पोस्ट करें',
    'community.share': 'साझा करें',
    'community.problem': 'समस्या',
    'community.tips': 'टिप्स',
    'community.experience': 'अनुभव',
    'community.market': 'बाजार',
    
    // Community categories
    'community.category.problem': 'समस्या',
    'community.category.tips': 'टिप्स',
    'community.category.experience': 'अनुभव',
    'community.category.market': 'बाजार',
    
    // Profile
    'profile.title': 'मेरी प्रोफाइल',
    'profile.farmingInfo': 'खेती की जानकारी',
    'profile.landSize': 'भूमि का आकार',
    'profile.experience': 'अनुभव',
    'profile.memberSince': 'सदस्य बने',
    'profile.language': 'भाषा',
    'profile.mainCrops': 'मुख्य फसलें',
    'profile.activityStats': 'गतिविधि सांख्यिकी',
    'profile.postsShared': 'पोस्ट साझा की',
    'profile.helpfulAnswers': 'सहायक उत्तर',
    'profile.questionsAsked': 'प्रश्न पूछे',
    'profile.creditsEarned': 'Credits कमाए',
    'profile.achievements': 'उपलब्धियां',
    'profile.settings': 'सेटिंग्स',
    'profile.changeLanguage': 'भाषा बदलें',
    'profile.redeemCredits': 'AgriCreds रिडीम करें',
    'profile.insufficientCredits': 'अपर्याप्त क्रेडिट',
    'profile.need50Credits': 'विशेषज्ञों से बात करने के लिए कम से कम 50 AgriCreds की आवश्यकता है',
    'profile.expertChatStarted': 'विशेषज्ञ चैट शुरू',
    'profile.redirectingToExpert': 'विशेषज्ञ परामर्श के लिए पुनर्निर्देशित कर रहा है...',
    'profile.credits': 'क्रेडिट',
    'profile.noAchievements': 'अभी तक कोई उपलब्धि नहीं',
    'profile.keepParticipating': 'उपलब्धियां कमाने के लिए भाग लेते रहें!',
    
    // Expert Consultation
    'expert.title': 'विशेषज्ञ परामर्श',
    'expert.availableExperts': 'उपलब्ध विशेषज्ञ',
    'expert.selectExpert': 'परामर्श शुरू करने के लिए विशेषज्ञ चुनें (सत्र के लिए 50 AgriCreds)',
    'expert.online': 'ऑनलाइन',
    'expert.offline': 'ऑफलाइन',
    'expert.connect': 'कनेक्ट करें',
    'expert.connecting': 'कनेक्ट हो रहा है...',
    'expert.connected': 'कनेक्ट हो गया',
    'expert.sessionStarted': 'विशेषज्ञ परामर्श सत्र शुरू हो गया',
    'expert.connectionFailed': 'कनेक्शन विफल',
    'expert.tryAgain': 'कृपया पुनः प्रयास करें',
    'expert.disconnect': 'डिस्कनेक्ट करें',
    'expert.disconnected': 'डिस्कनेक्ट हो गया',
    'expert.sessionEnded': 'विशेषज्ञ परामर्श सत्र समाप्त हो गया',
    'expert.sessionTime': 'सत्र',
    'expert.typing': 'विशेषज्ञ टाइप कर रहा है...',
    'expert.typeMessage': 'अपना संदेश लिखें...',
    'expert.loginRequired': 'लॉगिन आवश्यक',
    'expert.pleaseLogin': 'विशेषज्ञों से बात करने के लिए कृपया लॉगिन करें',
    
    // Common
    'common.now': 'अभी',
    'common.view': 'देखें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.ok': 'ठीक है',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.warning': 'चेतावनी',
    'common.info': 'जानकारी',
  },
  english: {
    // Header
    'header.agrisathi': 'AgriSathi',
    'header.language.hindi': 'हिं',
    'header.language.english': 'EN',
    
    // Navigation
    'nav.home': 'Home',
    'nav.scan': 'Scan',
    'nav.community': 'Community',
    'nav.chat': 'Chat',
    'nav.profile': 'Profile',
    
    // Dashboard
    'dashboard.welcome': 'Welcome, Farmer Brother!',
    'dashboard.subtitle': 'Better farming with modern technology',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.weather': "Today's Weather",
    'dashboard.cropRecommendations': 'Crop Recommendations',
    
    // Quick Actions
    'quickActions.scanCrop': 'Scan Crop',
    'quickActions.scanDescription': 'Disease Detection',
    'quickActions.voiceAsk': 'Ask by Voice',
    'quickActions.voiceDescription': 'Voice Assistant',
    'quickActions.expertChat': 'Expert Chat',
    'quickActions.expertDescription': 'Get instant advice',
    'quickActions.weather': 'Weather Info',
    'quickActions.weatherDescription': "Today's forecast",
    'quickActions.agriCreds': 'AgriCreds',
    'quickActions.earnMore': 'Earn more by contributing to the community!',
    
    // Weather
    'weather.today': "Today's Weather",
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind',
    'weather.uvIndex': 'UV Index',
    'weather.rainChance': 'Rain Chance',
    
    // Crop Recommendations
    'crops.recommendations': 'Crop Recommendations',
    'crops.season': 'Season',
    'crops.profitability': 'Profitability',
    'crops.high': 'High',
    'crops.medium': 'Medium',
    'crops.low': 'Low',
    'crops.yield': 'Yield',
    'crops.sowing': 'Sowing',
    'crops.marketRate': 'Market Rate',
    'crops.viewDetails': 'View Details',
    'crops.alerts': 'Alerts',
    
    // Crops
    'crops.tomato': 'Tomato',
    'crops.wheat': 'Wheat',
    'crops.season.rabi': 'Rabi',
    'crops.season.kharif': 'Kharif',
    'crops.profitability.high': 'High',
    'crops.profitability.medium': 'Medium',
    'crops.profitability.low': 'Low',
    'crops.yield.ton_per_hectare': 'ton/hectare',
    'crops.yield.qtl_per_hectare': 'quintal/hectare',
    'crops.market_unit.kg': 'kg',
    'crops.market_unit.qtl': 'quintal',
    'crops.sowing.oct_nov': 'October-November',
    'crops.sowing.nov_dec': 'November-December',
    // Alerts
    'alerts.tomato_pest': '🐛 Pest alert in tomato - treat immediately',
    'alerts.irrigation_needed': '💧 Irrigation needed - soil moisture is low',
    
    // Disease Detection
    'disease.title': 'Scan Crop',
    'disease.uploadPhoto': 'Upload Crop Photo',
    'disease.uploadDescription': 'Take clear photos of leaves, flowers, or fruits',
    'disease.gallery': 'Choose from Gallery',
    'disease.camera': 'Open Camera',
    'disease.uploadedPhoto': 'Uploaded Photo',
    'disease.startAnalysis': 'Start AI Analysis',
    'disease.analyzing': 'AI analysis in progress...',
    'disease.pleaseWait': 'Please wait',
    'disease.confidence': 'Confidence',
    'disease.severity': 'Severity',
    'disease.immediateActions': 'Immediate Actions',
    'disease.futurePrevention': 'Future Prevention',
    'disease.contactExpert': 'Contact Expert',
    'disease.buyMedicine': 'Buy Medicine',
    'disease.tips': 'Tips for better results',
    'disease.tip1': 'Take photos in natural light',
    'disease.tip2': 'Focus closely on the leaf',
    'disease.tip3': 'Take clear and sharp photos',
    'disease.tip4': 'Take photos from multiple angles',
    
    // Chat
    'chat.title': 'AI Chat Assistant',
    'chat.expertBanner': 'Need expert advice?',
    'chat.expertSubtitle': 'Talk to certified agricultural experts',
    'chat.call': 'Call',
    'chat.availableExperts': 'Available Experts',
    'chat.chat': 'Chat',
    'chat.nextAvailable': 'Next Available',
    'chat.voiceListening': 'Listening...',
    'chat.speakQuestion': 'Speak your question',
    'chat.writeQuestion': 'Write your question...',
    'chat.commonQuestions': 'Common Questions',
    'chat.weatherInfo': 'Weather Information',
    'chat.fertilizerAmount': 'Fertilizer Amount',
    'chat.seedTreatment': 'Seed Treatment',
    'chat.irrigationTime': 'Irrigation Time',
    'chat.placeholder': 'Type your message...',
    'chat.typing': 'Typing...',
    'chat.clear': 'Clear',
    'chat.cleared': 'Chat Cleared',
    'chat.startNewConversation': 'Start a new conversation',
    'chat.responseReceived': 'Response Received',
    'chat.usingRealData': 'Using real agricultural data',
    'chat.usingMockData': 'Using mock data',
    'chat.apiError': 'API Error',
    'chat.error': 'Failed to get response',
    
    // Community
    'community.title': 'Community Forum',
    'community.searchPosts': 'Search posts...',
    'community.post': 'Post',
    'community.newPost': 'Write New Post',
    'community.category': 'Category',
    'community.writeQuestion': 'Write your question or suggestion...',
    'community.addPhoto': 'Add Photo',
    'community.postNow': 'Post Now',
    'community.share': 'Share',
    'community.problem': 'Problem',
    'community.tips': 'Tips',
    'community.experience': 'Experience',
    'community.market': 'Market',
    
    // Community categories
    'community.category.problem': 'Problem',
    'community.category.tips': 'Tips',
    'community.category.experience': 'Experience',
    'community.category.market': 'Market',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.farmingInfo': 'Farming Information',
    'profile.landSize': 'Land Size',
    'profile.experience': 'Experience',
    'profile.memberSince': 'Member Since',
    'profile.language': 'Language',
    'profile.mainCrops': 'Main Crops',
    'profile.activityStats': 'Activity Statistics',
    'profile.postsShared': 'Posts Shared',
    'profile.helpfulAnswers': 'Helpful Answers',
    'profile.questionsAsked': 'Questions Asked',
    'profile.creditsEarned': 'Credits Earned',
    'profile.achievements': 'Achievements',
    'profile.settings': 'Settings',
    'profile.changeLanguage': 'Change Language',
    'profile.redeemCredits': 'Redeem AgriCreds',
    'profile.insufficientCredits': 'Insufficient Credits',
    'profile.need50Credits': 'You need at least 50 AgriCreds to chat with experts',
    'profile.expertChatStarted': 'Expert Chat Started',
    'profile.redirectingToExpert': 'Redirecting to expert consultation...',
    'profile.credits': 'Credits',
    'profile.noAchievements': 'No achievements yet',
    'profile.keepParticipating': 'Keep participating to earn achievements!',
    
    // Expert Consultation
    'expert.title': 'Expert Consultation',
    'expert.availableExperts': 'Available Experts',
    'expert.selectExpert': 'Select an expert to start consultation (50 AgriCreds per session)',
    'expert.online': 'Online',
    'expert.offline': 'Offline',
    'expert.connect': 'Connect',
    'expert.connecting': 'Connecting...',
    'expert.connected': 'Connected',
    'expert.sessionStarted': 'Expert consultation session started',
    'expert.connectionFailed': 'Connection Failed',
    'expert.tryAgain': 'Please try again',
    'expert.disconnect': 'Disconnect',
    'expert.disconnected': 'Disconnected',
    'expert.sessionEnded': 'Expert consultation session ended',
    'expert.sessionTime': 'Session',
    'expert.typing': 'Expert is typing...',
    'expert.typeMessage': 'Type your message...',
    'expert.loginRequired': 'Login Required',
    'expert.pleaseLogin': 'Please login to chat with experts',
    
    // Common
    'common.now': 'Now',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.ok': 'OK',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
  }
};

const LANGUAGE_STORAGE_KEY = 'anna-mitra-language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('hindi');

  // On mount, read language from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'hindi' || stored === 'english') {
      setLanguageState(stored);
    }
  }, []);

  // When language changes, persist to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 