/**
 * Centralized Translation File
 * English and Hindi translations for the AgriSathi app
 */

export const translations = {
  en: {
    // Authentication
    login: "Login",
    logout: "Logout",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    welcome: "Welcome",
    welcomeBack: "Welcome Back",
    
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    scan: "Scan",
    scanner: "Scanner",
    weather: "Weather",
    chat: "Chat",
    chatbot: "Chatbot",
    community: "Community",
    profile: "Profile",
    wallet: "Wallet",
    
    // Actions
    send: "Send",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    back: "Back",
    next: "Next",
    previous: "Previous",
    
        error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    
    // Time
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    
    // Messages
    noData: "No data available",
    connectionError: "Connection error",
    tryAgain: "Try again",
    refresh: "Refresh",
    loadingMore: "Loading more...",
    
    // App specific
    agriSathi: "AgriSathi",
    agriCreds: "AgriCreds",
    credits: "Credits",
    balance: "Balance",
    transaction: "Transaction",
    history: "History",
    
    // Notifications
    newMessage: "New Message",
    youHaveNewMessage: "You have a new message",
    cropUpdate: "Crop Update",
    cropStatusUpdated: "Your crop status has been updated",
    
    // Dashboard specific
    welcomeFarmer: "Welcome, Farmer!",
    farmerName: "Farmer",
    todaysWeather: "Today's Weather",
    detectingLocation: "Detecting location...",
    loading: "Loading...",
    unavailable: "Unavailable",
    enableLocation: "Enable Location",
    cropScanner: "Crop Scanner",
    aiChatbot: "AI Chatbot",
    weatherInfo: "Weather Info",
    farmerCommunity: "Farmer Community",
    shareExperiences: "Share experiences & learn from others",
    diseaseDetection: "Crop Doctor",
    scanCrop: "Detect diseases",
    askQuestion: "Ask about crops"
  },
  hi: {
    // Authentication
    login: "लॉगिन",
    logout: "लॉगआउट",
    signup: "साइन अप",
    email: "ईमेल",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    welcome: "स्वागत है",
    welcomeBack: "वापसी पर स्वागत",
    
    // Navigation
    home: "होम",
    dashboard: "डैशबोर्ड",
    scan: "स्कैन",
    scanner: "स्कैनर",
    weather: "मौसम",
    chat: "चैट",
    chatbot: "चैटबॉट",
    community: "समुदाय",
    profile: "प्रोफाइल",
    wallet: "वॉलेट",
    
    // Actions
    send: "भेजें",
    submit: "जमा करें",
    cancel: "रद्द करें",
    save: "सहेजें",
    delete: "हटाएं",
    edit: "संपादित करें",
    view: "देखें",
    back: "पीछे",
    next: "अगला",
    previous: "पिछला",
    
    // Status
    error: "त्रुटि",
    success: "सफलता",
    warning: "चेतावनी",
    info: "जानकारी",
    
    // Time
    hours: "घंटे",
    minutes: "मिनट",
    seconds: "सेकंड",
    
    // Messages
    noData: "कोई डेटा उपलब्ध",
    connectionError: "कनेक्शन त्रुटि",
    tryAgain: "फिर से कोशिश करें",
    refresh: "रिफ्रेश करें",
    loadingMore: "और लोड हो रहा है...",
    
    // App specific
    agriSathi: "एग्रीसाथी",
    agriCreds: "एग्रीक्रेड्स",
    credits: "क्रेडिट्स",
    balance: "शेष",
    transaction: "लेन-देन",
    history: "इतिहास",
    
    // Notifications
    newMessage: "नया संदेश",
    youHaveNewMessage: "आपके पास एक नया संदेश है",
    cropUpdate: "फसल अपडेट",
    cropStatusUpdated: "आपकी फसल की स्थिति अपडेट हुई है",
    
    // Dashboard specific
    welcomeFarmer: "स्वागत है, किसान भाई!",
    farmerName: "किसान भाई",
    todaysWeather: "आज का मौसम",
    detectingLocation: "स्थान का पता लगाया जा रहा है...",
    unavailable: "अनुपलब्ध",
    enableLocation: "स्थान सक्षम करें",
    cropScanner: "फसल स्कैनर",
    aiChatbot: "AI चैटबॉट",
    weatherInfo: "मौसम की जानकारी",
    farmerCommunity: "किसान समुदाय",
    shareExperiences: "अनुभव साझें और दूसरों से सीखें",
    diseaseDetection: "फसल डॉक्टर",
    scanCrop: "बीमारी पहचानें",
    askQuestion: "फसलों के बारे में पूछें"
  }
};

export type Language = 'en' | 'hi';
