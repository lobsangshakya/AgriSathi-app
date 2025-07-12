# API Setup Guide

This guide explains how to set up the API integration for the AgriSathi app.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=https://api.agrisathi.com
VITE_AI_SERVICE_URL=https://ai.agrisathi.com
VITE_AI_API_KEY=your_ai_api_key_here

# Supabase Configuration (if using Supabase)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Weather API (optional)
VITE_WEATHER_API_KEY=your_weather_api_key_here

# Disease Detection API (optional)
VITE_DISEASE_DETECTION_API_KEY=your_disease_detection_api_key_here

# Chatbot API (optional)
VITE_CHATBOT_API_KEY=your_chatbot_api_key_here
```

## Features Implemented

### 1. Disease Detection with Camera Scanning
- **Real-time camera capture** with scanning frame overlay
- **Image compression** for better API performance
- **Multiple AI models** for accurate disease detection
- **Fallback to basic API** if advanced AI fails
- **Crop type selection** for better accuracy
- **Analysis history** to track previous scans

### 2. AI-Powered Chatbot
- **Natural language processing** in Hindi and English
- **Context-aware responses** based on conversation history
- **Image analysis** through chat (camera integration)
- **Voice input simulation** (can be extended with real speech recognition)
- **Typing indicators** and auto-scroll
- **Expert consultation** integration

### 3. API Services
- **Disease Detection API**: Analyzes plant images for diseases
- **Chatbot API**: Handles natural language conversations
- **Weather API**: Provides weather data for farming decisions
- **Crop Recommendations API**: Suggests crops based on soil and season
- **Expert Consultation API**: Manages expert bookings
- **Market Prices API**: Provides crop price information
- **Soil Analysis API**: Analyzes soil from images

### 4. Mock API Service
- **Development-friendly**: Works without real backend
- **Realistic responses**: Simulates actual API behavior
- **Configurable delays**: Mimics real network latency
- **Multiple disease types**: Various plant diseases with detailed information
- **Bilingual support**: Hindi and English responses

## API Endpoints

### Disease Detection
```
POST /disease-detection
{
  "image": "base64_image_data",
  "cropType": "optional_crop_type",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Chatbot
```
POST /chat
{
  "message": "user_message",
  "context": {
    "language": "hindi",
    "nlpResult": {...}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Weather Data
```
GET /weather?lat=28.6139&lon=77.2090
```

### Crop Recommendations
```
POST /crop-recommendations
{
  "soilType": "loamy",
  "season": "rabi",
  "location": "Punjab"
}
```

## Camera Features

### Real-time Scanning
- **High-resolution capture** (1920x1080)
- **Front/back camera switching**
- **Flash control** (if supported)
- **Scanning frame overlay** with corner indicators
- **Error handling** for camera access issues

### Image Processing
- **Automatic compression** to 800px max dimension
- **JPEG format** with 80% quality
- **Base64 encoding** for API transmission
- **Preprocessing** for better AI analysis

## Usage Examples

### Disease Detection
1. Open the Disease Detection page
2. Select crop type (optional)
3. Click camera button or upload image
4. Wait for AI analysis (2-5 seconds)
5. View detailed results with treatment recommendations

### Chatbot
1. Open the Chat page
2. Type your question in Hindi or English
3. Use camera button to analyze plant images
4. Get instant AI-powered responses
5. Connect with experts if needed

## Development Mode

In development mode (`import.meta.env.DEV`), the app automatically uses mock APIs that provide realistic responses without requiring a real backend. This allows for:

- **Offline development**
- **Consistent testing**
- **No API costs**
- **Faster iteration**

## Production Deployment

For production, ensure you have:

1. **Real API endpoints** configured
2. **Valid API keys** in environment variables
3. **HTTPS enabled** for camera access
4. **CORS configured** on your backend
5. **Rate limiting** implemented
6. **Error handling** for API failures

## Troubleshooting

### Camera Issues
- Ensure HTTPS is enabled (required for camera access)
- Check browser permissions for camera access
- Try different browsers (Chrome recommended)
- Verify device camera is working

### API Issues
- Check environment variables are set correctly
- Verify API endpoints are accessible
- Check network connectivity
- Review browser console for errors

### Performance Issues
- Images are automatically compressed
- Use appropriate image sizes
- Consider implementing caching
- Monitor API response times 