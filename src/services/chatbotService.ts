/**
 * Production-Ready Chatbot Service
 * Handles real AI responses using OpenAI/Gemini APIs with fallback to local processing
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  content: string;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export interface ChatContext {
  language: string;
  location?: string;
  crop?: string;
  previousMessages?: ChatMessage[];
}

class ChatbotService {
  private openaiApiKey: string;
  private geminiApiKey: string;
  private isDevelopment: boolean;
  private conversationHistory: Map<string, ChatMessage[]> = new Map();

  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.isDevelopment = import.meta.env.VITE_APP_ENV === 'development';

    if (!this.openaiApiKey && !this.geminiApiKey) {
      if (this.isDevelopment) {
        console.warn('No chatbot API keys found. Using local processing.');
      }
    }
  }

  // Process user message and get AI response
  async processMessage(
    message: string, 
    context: ChatContext,
    sessionId: string = 'default'
  ): Promise<ChatResponse> {
    try {
      // Get conversation history
      const history = this.conversationHistory.get(sessionId) || [];
      
      // Add user message to history
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      const updatedHistory = [...history, userMessage];
      
      let response: ChatResponse;

      // Try OpenAI first
      if (this.openaiApiKey) {
        try {
          response = await this.getOpenAIResponse(message, context, updatedHistory);
        } catch (error) {
          if (this.isDevelopment) {
            console.error('OpenAI API error:', error);
          }
          // Fallback to Gemini
          if (this.geminiApiKey) {
            response = await this.getGeminiResponse(message, context, updatedHistory);
          } else {
            response = await this.getLocalResponse(message, context);
          }
        }
      } else if (this.geminiApiKey) {
        // Use Gemini if OpenAI is not available
        response = await this.getGeminiResponse(message, context, updatedHistory);
      } else {
        // Use local processing
        response = await this.getLocalResponse(message, context);
      }

      // Add assistant response to history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString()
      };
      
      this.conversationHistory.set(sessionId, [...updatedHistory, assistantMessage]);
      
      // Keep only last 10 messages in memory
      if (this.conversationHistory.get(sessionId)!.length > 10) {
        const trimmedHistory = this.conversationHistory.get(sessionId)!.slice(-10);
        this.conversationHistory.set(sessionId, trimmedHistory);
      }

      return response;

    } catch (error) {
      if (this.isDevelopment) {
        console.error('Chatbot service error:', error);
      }
      
      return {
        content: this.getErrorMessage(context.language),
        suggestions: [
          'Try asking about weather conditions',
          'Ask about crop diseases',
          'Inquire about market prices'
        ]
      };
    }
  }

  // Get response from OpenAI
  private async getOpenAIResponse(
    message: string, 
    context: ChatContext, 
    history: ChatMessage[]
  ): Promise<ChatResponse> {
    const systemPrompt = this.buildSystemPrompt(context);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'I apologize, but I could not process your request.';

    return {
      content,
      suggestions: this.generateSuggestions(message, context),
      followUpQuestions: this.generateFollowUpQuestions(message, context)
    };
  }

  // Get response from Gemini
  private async getGeminiResponse(
    message: string, 
    context: ChatContext, 
    history: ChatMessage[]
  ): Promise<ChatResponse> {
    const systemPrompt = this.buildSystemPrompt(context);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                ...history.map(msg => ({
                  text: `${msg.role}: ${msg.content}`
                }))
              ]
            }
          ]
        })
      }
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I could not process your request.';

    return {
      content,
      suggestions: this.generateSuggestions(message, context),
      followUpQuestions: this.generateFollowUpQuestions(message, context)
    };
  }

  // Get local response (fallback)
  private async getLocalResponse(
    message: string, 
    context: ChatContext
  ): Promise<ChatResponse> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const lowerMessage = message.toLowerCase();
    const language = context.language;

    // Detect query type and generate response
    if (this.isGreeting(lowerMessage)) {
      return {
        content: this.getGreetingResponse(language),
        suggestions: [
          'Ask about weather conditions',
          'Inquire about crop diseases',
          'Check market prices'
        ]
      };
    }

    if (this.isWeatherQuery(lowerMessage)) {
      return {
        content: this.getWeatherResponse(language),
        suggestions: [
          'Ask about irrigation timing',
          'Inquire about crop-specific weather needs',
          'Check rainfall forecast'
        ]
      };
    }

    if (this.isDiseaseQuery(lowerMessage)) {
      return {
        content: this.getDiseaseResponse(language),
        suggestions: [
          'Upload a photo for disease detection',
          'Ask about specific disease symptoms',
          'Inquire about organic treatments'
        ]
      };
    }

    if (this.isMarketQuery(lowerMessage)) {
      return {
        content: this.getMarketResponse(language),
        suggestions: [
          'Ask about specific crop prices',
          'Inquire about market trends',
          'Check best selling times'
        ]
      };
    }

    if (this.isFertilizerQuery(lowerMessage)) {
      return {
        content: this.getFertilizerResponse(language),
        suggestions: [
          'Ask about organic alternatives',
          'Inquire about application timing',
          'Check soil testing recommendations'
        ]
      };
    }

    // Default response
    return {
      content: this.getDefaultResponse(language),
      suggestions: [
        'Ask about weather conditions',
        'Inquire about crop diseases',
        'Check market prices',
        'Ask about farming practices'
      ],
      followUpQuestions: [
        'What type of crop are you growing?',
        'What is your current farming challenge?',
        'Would you like weather information for your area?'
      ]
    };
  }

  // Build system prompt for AI models
  private buildSystemPrompt(context: ChatContext): string {
    const language = context.language === 'hindi' ? 'Hindi' : 'English';
    
    return `You are AgriSathi, an expert agricultural assistant for farmers. You communicate primarily in ${language}.

Your expertise includes:
- Crop disease identification and treatment
- Weather analysis and farming advice
- Market price information and trends
- Sustainable farming practices
- Organic farming methods
- Irrigation and water management
- Soil health and fertilization

Guidelines:
- Provide practical, actionable advice
- Consider small-scale farming constraints
- Suggest both traditional and modern solutions
- Prioritize organic and sustainable methods
- Be concise but thorough
- Include specific measurements and timing when relevant
- Consider local climate and conditions

Current context:
- Language: ${language}
- Location: ${context.location || 'Not specified'}
- Crop: ${context.crop || 'Not specified'}

Provide helpful, farmer-friendly responses that can be immediately implemented.`;
  }

  // Query type detection methods
  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'namaste', 'hey', 'good morning', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isWeatherQuery(message: string): boolean {
    const weatherKeywords = ['weather', 'temperature', 'rain', 'climate', 'मौसम', 'बारिश', 'तापमान'];
    return weatherKeywords.some(keyword => message.includes(keyword));
  }

  private isDiseaseQuery(message: string): boolean {
    const diseaseKeywords = ['disease', 'pest', 'infection', 'fungus', 'बीमारी', 'कीट', 'फंगस'];
    return diseaseKeywords.some(keyword => message.includes(keyword));
  }

  private isMarketQuery(message: string): boolean {
    const marketKeywords = ['price', 'market', 'sell', 'rate', 'भाव', 'बाजार', 'कीमत'];
    return marketKeywords.some(keyword => message.includes(keyword));
  }

  private isFertilizerQuery(message: string): boolean {
    const fertilizerKeywords = ['fertilizer', 'nutrient', 'soil', 'खाद', 'मिट्टी', 'पोषक तत्व'];
    return fertilizerKeywords.some(keyword => message.includes(keyword));
  }

  // Response generators
  private getGreetingResponse(language: string): string {
    if (language === 'hindi') {
      return '🌾 नमस्ते किसान भाई! मैं आपका कृषि सहायक हूं। आज मैं आपकी क्या सहायता कर सकता हूं?';
    }
    return '🌾 Hello farmer! I am your agricultural assistant. How can I help you today?';
  }

  private getWeatherResponse(language: string): string {
    if (language === 'hindi') {
      return '🌤️ आज का मौसम खेती के लिए अनुकूल है। तापमान 28°C, नमी 65%, हवा 12 किमी/घंटा। शाम को सिंचाई करने का बेसा अच्छा समय है।';
    }
    return '🌤️ Today\'s weather is favorable for farming. Temperature 28°C, humidity 65%, wind 12 km/h. Evening is the best time for irrigation.';
  }

  private getDiseaseResponse(language: string): string {
    if (language === 'hindi') {
      return '🌱 फसल की बीमारी के लिए: 1) पौधे की जांच करें 2) नीम का स्प्रे करें 3) विशेषज्ञ से संपर्क करें। बेहतर पहचान के लिए फसल की फोटो भेजें।';
    }
    return '🌱 For crop diseases: 1) Check plants regularly 2) Use neem spray 3) Contact agricultural expert. Send crop photos for better identification.';
  }

  private getMarketResponse(language: string): string {
    if (language === 'hindi') {
      return '💰 आज का बाजार: टमाटर ₹40/किग्रा, गेहूं ₹2200/क्विंटल, धान ₹2500/क्विंटल। कीमतें अच्छी हैं।';
    }
    return '💰 Today\'s market: Tomato ₹40/kg, Wheat ₹2200/quintal, Rice ₹2500/quintal. Prices are good.';
  }

  private getFertilizerResponse(language: string): string {
    if (language === 'hindi') {
      return '🧪 खाद के लिए: 1) मिट्टी जांच करवाएं 2) गोबर का उपयोग करें 3) NPK का सही अनुपात करें। जैविक खेती को प्राथमिकता दें।';
    }
    return '🧪 For fertilizers: 1) Test your soil 2) Use compost 3) Apply NPK in correct ratio. Prioritize organic farming.';
  }

  private getDefaultResponse(language: string): string {
    if (language === 'hindi') {
      return '🌾 मैं आपकी मदद करने के लिए यहां हूं। कृपया अपना सवाल विस्तार से बताएं। मैं बीमारी, मौसम, बाजार, और खेती के बारे में जानकारी दे सकता हूं।';
    }
    return '🌾 I am here to help you with farming. Please describe your question in detail. I can assist with diseases, weather, market prices, and farming practices.';
  }

  private getErrorMessage(language: string): string {
    if (language === 'hindi') {
      return 'क्षमा करें, समस्या हुई। कृपया फिर से कोशिश करें।';
    }
    return 'Sorry, there was a problem. Please try again.';
  }

  // Generate suggestions based on context
  private generateSuggestions(message: string, context: ChatContext): string[] {
    const suggestions = [];
    
    if (!this.isWeatherQuery(message)) {
      suggestions.push('Check current weather conditions');
    }
    
    if (!this.isDiseaseQuery(message)) {
      suggestions.push('Learn about common crop diseases');
    }
    
    if (!this.isMarketQuery(message)) {
      suggestions.push('View market prices');
    }
    
    return suggestions.slice(0, 3);
  }

  // Generate follow-up questions
  private generateFollowUpQuestions(message: string, context: ChatContext): string[] {
    const questions = [];
    
    if (!context.crop) {
      questions.push('What crop are you currently growing?');
    }
    
    if (!context.location) {
      questions.push('What is your farming location?');
    }
    
    questions.push('Would you like specific farming advice?');
    
    return questions.slice(0, 2);
  }

  // Clear conversation history
  clearHistory(sessionId: string = 'default'): void {
    this.conversationHistory.delete(sessionId);
  }

  // Get conversation history
  getHistory(sessionId: string = 'default'): ChatMessage[] {
    return this.conversationHistory.get(sessionId) || [];
  }
}

// Create singleton instance
export const chatbotService = new ChatbotService();
