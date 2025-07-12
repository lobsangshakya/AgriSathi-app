# Real API Setup Guide

This guide explains how to set up real APIs to get accurate agricultural information instead of mock responses.

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

# Real API Keys for Production
# Get these from the respective services:

# OpenWeatherMap API (for real weather data)
# Sign up at: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Plant.id API (for real disease detection)
# Sign up at: https://web.plant.id/api-access-request/
VITE_PLANT_ID_API_KEY=your_plant_id_api_key_here

# Agriculture API (for crop data)
# Sign up at: https://rapidapi.com/collection/agriculture-apis
VITE_AGRICULTURE_API_KEY=your_agriculture_api_key_here

# OpenAI API (for advanced chatbot)
# Sign up at: https://platform.openai.com/
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Google AI API (alternative for chatbot)
# Sign up at: https://ai.google.dev/
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

## API Services Setup

### 1. OpenWeatherMap API (Weather Data)
- **Purpose**: Get real-time weather data for agricultural decisions
- **Sign up**: https://openweathermap.org/api
- **Free tier**: 1,000 calls/day
- **Features**: Current weather, forecasts, historical data

### 2. Plant.id API (Disease Detection)
- **Purpose**: Real plant disease identification from images
- **Sign up**: https://web.plant.id/api-access-request/
- **Free tier**: 500 identifications/month
- **Features**: Plant identification, disease detection, health assessment

### 3. Agriculture APIs (Crop Data)
- **Purpose**: Get accurate crop information, market prices, recommendations
- **Sign up**: https://rapidapi.com/collection/agriculture-apis
- **Free tier**: Varies by API
- **Features**: Crop data, market prices, soil analysis

### 4. OpenAI API (Advanced Chatbot)
- **Purpose**: Natural language processing for better chatbot responses
- **Sign up**: https://platform.openai.com/
- **Free tier**: $5 credit
- **Features**: GPT models, natural language understanding

## Features with Real APIs

### Real Weather Integration
- **Current weather**: Temperature, humidity, wind speed
- **Forecasts**: 5-day weather predictions
- **Agricultural advice**: Based on weather conditions
- **Location-based**: Uses GPS coordinates

### Real Disease Detection
- **Plant identification**: Identifies plant species
- **Disease detection**: Detects diseases and health issues
- **Treatment recommendations**: Based on actual disease data
- **Confidence scores**: AI confidence in detection

### Real Agricultural Knowledge
- **Crop information**: Accurate farming guides
- **Fertilizer recommendations**: Based on soil and crop type
- **Pest control**: Real pest identification and control methods
- **Market prices**: Live market data

### Advanced Chatbot
- **Natural language**: Better understanding of questions
- **Context awareness**: Remembers conversation context
- **Multilingual**: Hindi and English support
- **Real-time data**: Weather, prices, recommendations

## Development vs Production

### Development Mode (Default)
- Uses mock APIs for testing
- No API keys required
- Fast development cycle
- Realistic but static responses

### Production Mode
- Uses real APIs for accurate data
- Requires API keys
- Real-time information
- Accurate agricultural advice

## Switching to Real APIs

1. **Get API keys** from the services listed above
2. **Create .env file** with your API keys
3. **Restart the development server**
4. **Test the features** to ensure they work

## Cost Considerations

### Free Tiers Available
- **OpenWeatherMap**: 1,000 calls/day
- **Plant.id**: 500 identifications/month
- **OpenAI**: $5 credit
- **Agriculture APIs**: Varies by provider

### Paid Plans
- **OpenWeatherMap**: $40/month for 50,000 calls
- **Plant.id**: $99/month for 50,000 identifications
- **OpenAI**: Pay per use
- **Agriculture APIs**: Varies by provider

## Troubleshooting

### API Key Issues
- Ensure API keys are correctly set in .env file
- Check API key permissions and quotas
- Verify API endpoints are accessible

### Rate Limiting
- Monitor API usage
- Implement caching for frequently requested data
- Use fallback to mock APIs when limits are reached

### Network Issues
- Check internet connectivity
- Verify API endpoints are accessible
- Implement retry logic for failed requests

## Security Notes

- **Never commit API keys** to version control
- **Use environment variables** for sensitive data
- **Monitor API usage** to prevent abuse
- **Implement rate limiting** in production

## Example Usage

Once configured, the chatbot will provide:

```javascript
// Real weather data
"🌤️ आज का मौसम कृषि के लिए अनुकूल है:
🌡️ तापमान: 28°C
💧 आर्द्रता: 65%
🌬️ हवा: 12 km/h
☔ स्थिति: आंशिक बादल"

// Real disease detection
"रोग: पत्ती का धब्बा रोग
विश्वास: 92%
गंभीरता: मध्यम
उपचार: कॉपर ऑक्सीक्लोराइड का छिड़काव"

// Real crop information
"🌾 गेहूं की खेती के लिए विस्तृत गाइड:
📅 बुआई का समय: नवंबर-दिसंबर
🌱 मिट्टी: दोमट से भारी दोमट
💧 सिंचाई: 3-4 बार
🌿 खाद: यूरिया 120kg/हेक्टेयर"
``` 