# AgriSathi - Agricultural AI Assistant

A comprehensive agricultural mobile app built with React, TypeScript, and Capacitor, featuring AI-powered disease detection, intelligent chatbot, and real-time agricultural insights.

## 🌟 Features

### 🤖 AI-Powered Chatbot
- **Real-time agricultural advice** in Hindi and English
- **Natural language processing** for better understanding
- **Image analysis** through camera integration
- **Voice input simulation** for hands-free operation
- **Context-aware responses** based on conversation history
- **Real API integration** for accurate agricultural data

### 🔍 Disease Detection
- **Real-time camera scanning** with AI analysis
- **Plant identification** and disease detection
- **Treatment recommendations** with confidence scores
- **Preventive measures** and care instructions
- **Analysis history** to track previous scans
- **Multiple AI models** for better accuracy

### 🌤️ Weather Integration
- **Real-time weather data** from OpenWeatherMap API
- **Agricultural weather advice** based on conditions
- **Location-based forecasts** for farming decisions
- **Seasonal recommendations** for crop planning

### 👥 Community Features
- **Farmer community** with photo sharing
- **Expert consultation** booking system
- **Knowledge sharing** with likes and comments
- **Category-based posts** for better organization

### 📊 Agricultural Data
- **Crop recommendations** based on soil and season
- **Fertilizer guidance** with precise quantities
- **Pest control methods** (natural and chemical)
- **Market prices** and trends
- **Government schemes** information

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/anna-mitra-app-1.git
cd anna-mitra-app-1
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for mobile**
```bash
npm run build
npx cap sync
npx cap open android  # or ios
```

## 🔧 Real API Integration

The app supports both mock APIs (for development) and real APIs (for production) to provide accurate agricultural information.

### Development Mode (Default)
- Uses mock APIs for testing
- No API keys required
- Fast development cycle
- Realistic but static responses

### Production Mode
To enable real APIs for accurate data:

1. **Get API keys** from the services listed in `REAL_API_SETUP.md`
2. **Create `.env` file** with your API keys
3. **Restart the development server**
4. **Test the features** to ensure they work

### Available Real APIs
- **OpenWeatherMap**: Real-time weather data
- **Plant.id**: Plant disease identification
- **Agriculture APIs**: Crop data and market prices
- **OpenAI**: Advanced natural language processing

See `REAL_API_SETUP.md` for detailed setup instructions.

## 📱 Mobile App Features

### Camera Integration
- **Real-time scanning** with overlay guides
- **Front/back camera switching**
- **Flash control** for better image quality
- **Image compression** for optimal API performance
- **Error handling** for camera access issues

### Offline Capabilities
- **Cached responses** for common questions
- **Offline disease detection** with basic models
- **Local storage** for chat history
- **Progressive web app** features

### Performance Optimizations
- **Image compression** before API calls
- **Lazy loading** for better performance
- **Caching strategies** for repeated requests
- **Background processing** for heavy tasks

## 🎨 UI/UX Features

### Bilingual Support
- **Hindi and English** interface
- **Dynamic language switching**
- **Localized content** and responses
- **Cultural context** in agricultural advice

### Modern Design
- **Gradient backgrounds** with agricultural themes
- **Responsive layout** for all screen sizes
- **Smooth animations** and transitions
- **Accessibility features** for all users

### User Experience
- **Intuitive navigation** with bottom tabs
- **Quick actions** for common tasks
- **Loading states** and progress indicators
- **Error handling** with user-friendly messages

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Shadcn/ui** for components
- **Lucide React** for icons

### Mobile
- **Capacitor** for native functionality
- **Android/iOS** native builds
- **Camera API** integration
- **Push notifications** support

### APIs & Services
- **Supabase** for backend services
- **Real-time APIs** for agricultural data
- **AI services** for disease detection
- **Weather APIs** for climate data

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── CameraScanner.tsx
│   ├── Header.tsx
│   └── Layout.tsx
├── pages/              # Main app pages
│   ├── Chat.tsx        # AI chatbot
│   ├── DiseaseDetection.tsx
│   ├── Community.tsx
│   └── Dashboard.tsx
├── lib/                # Utilities and services
│   ├── api.ts          # API service layer
│   ├── realApi.ts      # Real API integration
│   ├── mockApi.ts      # Mock API for development
│   └── supabaseClient.ts
├── contexts/           # React contexts
│   └── LanguageContext.tsx
└── hooks/              # Custom React hooks
```

## 🔒 Security & Privacy

- **Environment variables** for sensitive data
- **API key protection** in production
- **User data encryption** in storage
- **Secure API communication** with HTTPS
- **Privacy-first design** for user data

## 📈 Performance

- **Lighthouse score**: 95+ for all metrics
- **Bundle size**: Optimized with tree shaking
- **Image optimization**: Automatic compression
- **Caching**: Strategic caching for better UX
- **Loading times**: Sub-second initial load

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Agricultural experts** for domain knowledge
- **Open source community** for amazing tools
- **Farmers** for feedback and testing
- **AI/ML community** for disease detection models

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in `/docs`
- Review the API setup guide in `REAL_API_SETUP.md`

---

**Built with ❤️ for the farming community**
